import { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, Wind, Sparkles, PartyPopper, Check } from 'lucide-react';

// Play realistic cutting sound using Web Audio API
function playSliceSound() {
  try {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    const ctx = new AudioCtor();

    // Noise buffer for realistic blade cutting through sponge & frosting
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.22);
    filter.Q.value = 3.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.25);
    setTimeout(() => ctx.close().catch(() => {}), 350);
  } catch (e) {
    console.warn('Sound effect failed', e);
  }
}

export default function RealisticCake({ blown, cut, onBlow, onCut, recipientName = '' }) {
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [knifePos, setKnifePos] = useState({ x: 260, y: 30 });
  const [isDraggingKnife, setIsDraggingKnife] = useState(false);
  const [hasCutInitiated, setHasCutInitiated] = useState(false);
  const [sliceProgress, setSliceProgress] = useState(0);

  const containerRef = useRef(null);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);
  const blowStreakRef = useRef(0);

  // Microphone breath / blow detection
  useEffect(() => {
    if (blown) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }

    let isCancelled = false;

    const startMic = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMicError(true);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const AudioCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtor) return;

        const ctx = new AudioCtor();
        audioCtxRef.current = ctx;

        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const monitorAudio = () => {
          if (isCancelled) return;
          analyser.getByteFrequencyData(dataArray);

          // Calculate energy across frequency bands
          let sum = 0;
          let lowFreqSum = 0;
          const lowBins = Math.floor(dataArray.length * 0.25);

          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
            if (i < lowBins) lowFreqSum += dataArray[i];
          }

          const avg = sum / dataArray.length;
          const normalized = Math.min(1, avg / 120);
          setAudioLevel(normalized);

          // Blowing produces heavy low frequency air disturbance
          const lowEnergy = lowFreqSum / lowBins;
          if (lowEnergy > 55 || avg > 65) {
            blowStreakRef.current += 1;
            if (blowStreakRef.current >= 4) {
              // Successfully blown!
              onBlow?.();
              setMicActive(false);
              return;
            }
          } else {
            blowStreakRef.current = Math.max(0, blowStreakRef.current - 1);
          }

          animFrameRef.current = requestAnimationFrame(monitorAudio);
        };

        setMicActive(true);
        monitorAudio();
      } catch (err) {
        console.log('Mic access error or denied:', err);
        setMicError(true);
      }
    };

    startMic();

    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [blown, onBlow]);

  // Handle knife drag movement
  const handlePointerDown = (e) => {
    if (!blown || cut) return;
    setIsDraggingKnife(true);
    e.target.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingKnife || !containerRef.current || cut) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(rect.width - 20, e.clientX - rect.left));
    const y = Math.max(10, Math.min(rect.height - 20, e.clientY - rect.top));

    setKnifePos({ x, y });

    // Check if knife is over the cake center cutting area (roughly center x: 130-230, y: 110-210)
    const cakeCenterX = rect.width / 2;
    const cakeCenterY = rect.height * 0.52;

    const distFromCenter = Math.hypot(x - cakeCenterX, y - cakeCenterY);

    if (distFromCenter < 75 && y > cakeCenterY - 30) {
      // User is slicing into the cake!
      const progress = Math.min(1, Math.max(0, (y - (cakeCenterY - 30)) / 70));
      setSliceProgress(progress);

      if (progress >= 0.75 && !hasCutInitiated) {
        setHasCutInitiated(true);
        setIsDraggingKnife(false);
        playSliceSound();
        onCut?.();
      }
    }
  };

  const handlePointerUp = (e) => {
    if (isDraggingKnife) {
      setIsDraggingKnife(false);
      try {
        e.target.releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
      // If user released while deep in the slice zone, finish the cut!
      if (sliceProgress > 0.4 && !cut) {
        playSliceSound();
        onCut?.();
      }
    }
  };

  const handleQuickCut = () => {
    playSliceSound();
    onCut?.();
  };

  return (
    <div className="realistic-cake-wrapper" ref={containerRef}>
      {/* Dynamic Candle Light Glow Ambient */}
      <div className={`cake-ambient-glow ${blown ? 'blown' : ''}`} />

      {/* SVG Canvas for High-Fidelity 3D Cake & Candle Flames */}
      <div
        className={`cake-scene-container ${blown ? 'blown' : ''} ${cut ? 'cut' : ''}`}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg
          viewBox="0 0 360 300"
          className="realistic-cake-svg"
          aria-label="Realistic Birthday Cake"
        >
          <defs>
            {/* Cake Stand Shading */}
            <linearGradient id="standGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="35%" stopColor="#f8fafc" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>

            <linearGradient id="plateTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>

            {/* Bottom Tier Frosting Gradients */}
            <linearGradient id="bottomFrosting" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="25%" stopColor="#f9a8d4" />
              <stop offset="60%" stopColor="#fbcfe8" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            <linearGradient id="bottomTop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff1f2" />
              <stop offset="100%" stopColor="#fce7f3" />
            </linearGradient>

            {/* Top Tier Frosting Gradients */}
            <linearGradient id="topFrosting" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="30%" stopColor="#ffe4e6" />
              <stop offset="70%" stopColor="#fff1f2" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            <linearGradient id="topSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ffe4e6" />
            </linearGradient>

            {/* Dripping Glaze Gradient */}
            <linearGradient id="dripGlaze" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#831843" />
              <stop offset="60%" stopColor="#be185d" />
              <stop offset="100%" stopColor="#db2777" />
            </linearGradient>

            {/* Realistic Candle Stripes */}
            <linearGradient id="candle1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="candle2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
            <linearGradient id="candle3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="candle4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>

            {/* Candle Flame Radiance */}
            <radialGradient id="flameInner" cx="50%" cy="65%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ea580c" />
            </radialGradient>

            <radialGradient id="flameHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(251,191,36,0.55)" />
              <stop offset="55%" stopColor="rgba(245,158,11,0.2)" />
              <stop offset="100%" stopColor="rgba(234,88,12,0)" />
            </radialGradient>

            {/* Cut Cake Sponge Layers */}
            <linearGradient id="spongeCake" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="50%" stopColor="#ffedd5" />
              <stop offset="100%" stopColor="#fcd34d" />
            </linearGradient>
            <linearGradient id="creamFill" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fdf2f8" />
            </linearGradient>
            <linearGradient id="jamLayer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9f1239" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>

          {/* 1. Stand and Pedestal */}
          <g className="cake-stand">
            {/* Stand shadow */}
            <ellipse cx="180" cy="272" rx="130" ry="18" fill="rgba(0,0,0,0.38)" filter="blur(6px)" />
            {/* Pedestal Foot */}
            <path d="M145 258 Q180 266 215 258 L206 244 Q180 248 154 244 Z" fill="url(#standGrad)" />
            {/* Pedestal Stem */}
            <path d="M162 246 Q180 250 198 246 L195 234 Q180 236 165 234 Z" fill="url(#standGrad)" />
            {/* Big Plate Rim */}
            <ellipse cx="180" cy="235" rx="145" ry="26" fill="url(#standGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
            {/* Plate Surface Top */}
            <ellipse cx="180" cy="233" rx="136" ry="22" fill="url(#plateTop)" />
          </g>

          {/* 2. Cake Bottom Tier */}
          <g className={`cake-bottom-tier ${cut ? 'cake-cut-active' : ''}`}>
            {/* Bottom tier body cylinder */}
            <path
              d="M75 175 Q180 196 285 175 L285 220 Q180 244 75 220 Z"
              fill="url(#bottomFrosting)"
            />
            {/* Bottom tier top surface */}
            <ellipse cx="180" cy="175" rx="105" ry="21" fill="url(#bottomTop)" />

            {/* Bottom tier dripping ganache glaze */}
            <path
              d="M75 175
                 Q92 184 105 177
                 C110 188 116 198 122 195
                 C128 192 131 180 138 178
                 C144 186 150 202 158 200
                 C164 198 168 182 176 179
                 C184 188 192 204 199 202
                 C206 199 209 181 216 178
                 C222 186 228 194 235 192
                 C242 190 246 179 255 177
                 Q270 182 285 175
                 Q180 196 75 175 Z"
              fill="url(#dripGlaze)"
              opacity="0.9"
            />

            {/* Bottom rim piped cream pearls */}
            {[80, 96, 114, 134, 156, 180, 204, 226, 246, 264, 280].map((x, idx) => (
              <circle
                key={`pearl-${idx}`}
                cx={x}
                cy={218 + Math.sin((x - 80) / 200 * Math.PI) * 12}
                r="6.5"
                fill="#ffffff"
                stroke="#fce7f3"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* 3. Cake Top Tier */}
          <g className={`cake-top-tier ${cut ? 'cake-cut-active' : ''}`}>
            {/* Top tier body cylinder */}
            <path
              d="M108 118 Q180 134 252 118 L252 162 Q180 180 108 162 Z"
              fill="url(#topFrosting)"
            />
            {/* Top tier surface */}
            <ellipse cx="180" cy="118" rx="72" ry="17" fill="url(#topSurface)" />

            {/* Top tier dripping glaze */}
            <path
              d="M108 118
                 C118 126 124 139 130 137
                 C136 135 138 122 144 121
                 C150 128 156 142 163 140
                 C170 138 174 123 180 121
                 C186 128 192 143 198 141
                 C204 139 208 123 216 121
                 C223 129 230 136 236 134
                 C242 132 246 120 252 118
                 Q180 134 108 118 Z"
              fill="url(#dripGlaze)"
              opacity="0.88"
            />

            {/* Rainbow Sprinkles on top */}
            {[
              { x: 140, y: 114, c: '#38bdf8', r: 25 },
              { x: 155, y: 122, c: '#fbbf24', r: -15 },
              { x: 168, y: 112, c: '#34d399', r: 40 },
              { x: 195, y: 114, c: '#f43f5e', r: -30 },
              { x: 208, y: 122, c: '#a855f7', r: 20 },
              { x: 222, y: 113, c: '#fbbf24', r: 50 },
              { x: 178, y: 124, c: '#38bdf8', r: 0 },
            ].map((sp, idx) => (
              <rect
                key={`sprinkle-${idx}`}
                x={sp.x}
                y={sp.y}
                width="6.5"
                height="2.5"
                rx="1.2"
                fill={sp.c}
                transform={`rotate(${sp.r} ${sp.x} ${sp.y})`}
              />
            ))}

            {/* Whipped cream swirls and strawberries on top rim */}
            {[122, 148, 180, 212, 238].map((cx, idx) => {
              const cy = 112 + Math.sin((cx - 122) / 116 * Math.PI) * 7;
              return (
                <g key={`rosette-${idx}`}>
                  {/* Swirl */}
                  <ellipse cx={cx} cy={cy} rx="8" ry="6" fill="#fff" stroke="#fbcfe8" strokeWidth="0.8" />
                  <path
                    d={`M${cx - 4} ${cy} Q${cx} ${cy - 7} ${cx + 4} ${cy}`}
                    fill="none"
                    stroke="#fda4af"
                    strokeWidth="1.2"
                  />
                  {/* Strawberry */}
                  <path
                    d={`M${cx} ${cy - 8} C${cx - 5} ${cy - 12} ${cx - 5} ${cy - 16} ${cx} ${cy - 18} C${cx + 5} ${cy - 16} ${cx + 5} ${cy - 12} ${cx} ${cy - 8} Z`}
                    fill="#e11d48"
                  />
                  {/* Strawberry seeds */}
                  <circle cx={cx - 1.5} cy={cy - 13} r="0.6" fill="#fef08a" />
                  <circle cx={cx + 1.5} cy={cy - 14} r="0.6" fill="#fef08a" />
                  <circle cx={cx} cy={cy - 11} r="0.6" fill="#fef08a" />
                  {/* Green Leaf */}
                  <path
                    d={`M${cx} ${cy - 18} Q${cx - 3} ${cy - 21} ${cx - 4} ${cy - 19} Q${cx} ${cy - 18} ${cx + 4} ${cy - 20}`}
                    fill="#15803d"
                  />
                </g>
              );
            })}
          </g>

          {/* 4. Realistic Sliced Piece (Separates smoothly when cut) */}
          {cut && (
            <g className="realistic-slice-piece anim-slice-slide">
              {/* Separate Plate for the Slice */}
              <ellipse cx="282" cy="242" rx="46" ry="12" fill="url(#plateTop)" stroke="#cbd5e1" strokeWidth="1" />
              {/* Slice Wedge Body */}
              <path
                d="M260 178 L310 192 L298 238 L252 222 Z"
                fill="url(#spongeCake)"
              />
              {/* Internal Cream Filling Lines */}
              <path d="M256 192 L304 206" stroke="url(#creamFill)" strokeWidth="3" strokeLinecap="round" />
              <path d="M254 204 L301 218" stroke="url(#jamLayer)" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M253 214 L299 228" stroke="url(#creamFill)" strokeWidth="3" strokeLinecap="round" />
              {/* Top Frosting of the Slice */}
              <path d="M260 178 L310 192 L285 174 L240 162 Z" fill="url(#topFrosting)" opacity="0.95" />
              {/* Cream Rosette on Slice */}
              <ellipse cx="286" cy="180" rx="7" ry="5" fill="#fff" />
              <path
                d="M286 177 C282 173 282 169 286 167 C290 169 290 173 286 177 Z"
                fill="#e11d48"
              />
              {/* Moist Cake Crumbs on Plate */}
              <circle cx="266" cy="235" r="1.5" fill="#d97706" />
              <circle cx="272" cy="238" r="1" fill="#d97706" />
              <circle cx="295" cy="242" r="1.8" fill="#d97706" />
              <circle cx="304" cy="239" r="1.2" fill="#d97706" />
            </g>
          )}

          {/* Cut Wedge Void Interior inside the main cake when cut */}
          {cut && (
            <g className="cake-cut-interior">
              <path
                d="M180 118 L218 140 L218 184 L180 160 Z"
                fill="url(#spongeCake)"
                opacity="0.98"
              />
              <path d="M180 132 L218 154" stroke="url(#creamFill)" strokeWidth="2.5" />
              <path d="M180 144 L218 166" stroke="url(#jamLayer)" strokeWidth="2.5" />
              <path d="M180 154 L218 176" stroke="url(#creamFill)" strokeWidth="2.5" />
            </g>
          )}

          {/* 5. Four Realistic Striped Candles */}
          {[
            { id: 1, x: 150, y: 78, h: 36, grad: 'url(#candle1)', color: '#38bdf8' },
            { id: 2, x: 170, y: 72, h: 39, grad: 'url(#candle2)', color: '#fb7185' },
            { id: 3, x: 190, y: 72, h: 39, grad: 'url(#candle3)', color: '#facc15' },
            { id: 4, x: 210, y: 78, h: 36, grad: 'url(#candle4)', color: '#a855f7' },
          ].map((c) => {
            const candleTopY = c.y;
            const wickY = candleTopY - 7;
            const flameCenterY = wickY - 14;

            return (
              <g key={`candle-${c.id}`} className="realistic-candle">
                {/* Candle Stick */}
                <rect
                  x={c.x - 3.5}
                  y={candleTopY}
                  width="7"
                  height={c.h}
                  rx="2.5"
                  fill={c.grad}
                  stroke="rgba(0,0,0,0.12)"
                  strokeWidth="0.6"
                />
                {/* Spiral candy stripes */}
                <path
                  d={`M${c.x - 3.5} ${candleTopY + 8} L${c.x + 3.5} ${candleTopY + 14}
                      M${c.x - 3.5} ${candleTopY + 18} L${c.x + 3.5} ${candleTopY + 24}`}
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                {/* Wick */}
                <line
                  x1={c.x}
                  y1={candleTopY}
                  x2={c.x}
                  y2={wickY}
                  stroke="#334155"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />

                {/* Animated Candle Flame */}
                {!blown && (
                  <g className="realistic-flame-group">
                    {/* Outer warm halo */}
                    <circle
                      cx={c.x}
                      cy={flameCenterY}
                      r="18"
                      fill="url(#flameHalo)"
                      className="flame-halo"
                    />
                    {/* Flame Teardrop */}
                    <path
                      d={`M${c.x} ${flameCenterY - 14}
                          C${c.x + 6} ${flameCenterY - 6} ${c.x + 6} ${flameCenterY + 4} ${c.x} ${flameCenterY + 6}
                          C${c.x - 6} ${flameCenterY + 4} ${c.x - 6} ${flameCenterY - 6} ${c.x} ${flameCenterY - 14} Z`}
                      fill="url(#flameInner)"
                      className="flame-body"
                    />
                    {/* Blue inner core */}
                    <ellipse
                      cx={c.x}
                      cy={flameCenterY + 4}
                      rx="2.4"
                      ry="3.5"
                      fill="#67e8f9"
                      opacity="0.85"
                    />
                  </g>
                )}

                {/* Smoke Wisps after Blown */}
                {blown && (
                  <g className="smoke-wisp">
                    <path
                      d={`M${c.x} ${wickY} Q${c.x - 4} ${wickY - 10} ${c.x + 2} ${wickY - 20} T${c.x - 2} ${wickY - 32}`}
                      fill="none"
                      stroke="rgba(203,213,225,0.7)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      className="smoke-trail"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* 6. Interactive Realistic Moving Knife */}
        {blown && !cut && (
          <div
            className={`realistic-knife-container ${isDraggingKnife ? 'dragging' : 'idle-bounce'}`}
            style={{
              left: `${knifePos.x}px`,
              top: `${knifePos.y}px`,
            }}
            onPointerDown={handlePointerDown}
            title="Drag the knife across the cake to cut!"
          >
            {/* Realistic Knife SVG */}
            <svg viewBox="0 0 160 55" className="realistic-knife-svg">
              <defs>
                {/* Shiny Stainless Steel Blade Gradient */}
                <linearGradient id="bladeShine" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="35%" stopColor="#e2e8f0" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="70%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* Handle Gradient */}
                <linearGradient id="handleWood" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#451a03" />
                  <stop offset="45%" stopColor="#78350f" />
                  <stop offset="100%" stopColor="#290e02" />
                </linearGradient>

                {/* Brass Rivet Gradient */}
                <linearGradient id="brassRivet" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              </defs>

              <g transform="rotate(-25 80 27)">
                {/* Knife Blade */}
                <path
                  d="M12 28 C30 27 75 25 105 24 L105 34 C75 35 32 38 12 28 Z"
                  fill="url(#bladeShine)"
                  stroke="#64748b"
                  strokeWidth="0.8"
                />
                {/* Sharp Blade Edge Line */}
                <path
                  d="M12 28 C32 38 75 35 105 34"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
                {/* Metallic Reflection Slash */}
                <polygon points="35,27 48,26 38,36 28,36" fill="rgba(255,255,255,0.75)" />

                {/* Bolster (Silver Collar) */}
                <rect x="105" y="22" width="6" height="15" rx="1.5" fill="#94a3b8" stroke="#475569" strokeWidth="0.6" />

                {/* Wooden Handle */}
                <path
                  d="M111 23 C125 21 146 22 154 26 C157 29 157 32 154 35 C146 38 125 38 111 36 Z"
                  fill="url(#handleWood)"
                  stroke="#1c0a00"
                  strokeWidth="0.8"
                />

                {/* Brass Rivets on Handle */}
                <circle cx="122" cy="29.5" r="2.2" fill="url(#brassRivet)" stroke="#78350f" strokeWidth="0.5" />
                <circle cx="138" cy="29.5" r="2.2" fill="url(#brassRivet)" stroke="#78350f" strokeWidth="0.5" />
              </g>
            </svg>
            <div className="knife-drag-hint">Drag across cake to slice</div>
          </div>
        )}
      </div>

      {/* Interactive Controls & Status Feedback */}
      <div className="cake-interaction-tray">
        {!blown && (
          <div className="cake-action-card">
            {/* Live Audio Level Meter */}
            <div className="mic-meter-wrapper">
              <div className="mic-meter-indicator">
                <Mic size={14} className="mic-icon" />
                <div className="mic-meter-track">
                  <div
                    className="mic-meter-fill"
                    style={{ width: `${Math.round(audioLevel * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <p className="cake-prompt-text">
              <strong>Blow gently into your microphone</strong> to extinguish the candles
            </p>

            {/* Clean fallback button */}
            <button
              type="button"
              className="btn btn-secondary cake-fallback-btn"
              onClick={onBlow}
            >
              <Wind size={14} />
              <span>Tap to blow candles</span>
            </button>
          </div>
        )}

        {blown && !cut && (
          <div className="cake-action-card anim-bounce-in">
            <p className="cake-prompt-text">
              <strong>The candles are out!</strong> Move the knife across the cake or tap below to slice.
            </p>
            <button
              type="button"
              className="btn btn-primary cake-cut-btn"
              onClick={handleQuickCut}
            >
              <Sparkles size={15} />
              <span>Slice the Cake</span>
            </button>
          </div>
        )}

        {cut && (
          <div className="cake-action-card celebration-card anim-bounce-in">
            <div className="celebration-badge">
              <PartyPopper size={16} />
              <span>Celebration Time</span>
            </div>
            <p className="cake-celebration-title">
              Happy Birthday{recipientName ? `, ${recipientName}` : ''}!
            </p>
            <p className="cake-celebration-subtitle">
              The cake is sliced. May your year be filled with happiness and sweet moments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
