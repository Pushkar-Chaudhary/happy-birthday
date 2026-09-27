import { useCallback, useEffect, useRef, useState } from 'react';

const melody = [
  392.0, 392.0, 440.0, 392.0, 523.25, 493.88,
  392.0, 392.0, 440.0, 392.0, 587.33, 523.25,
  392.0, 392.0, 659.25, 523.25, 587.33, 523.25,
  493.88, 440.0, 659.25, 659.25, 587.33, 523.25,
  587.33, 659.25, 523.25, 392.0, 392.0, 440.0,
  392.0, 523.25, 493.88,
];

export function useBirthdaySong() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const synthContextRef = useRef(null);

  // Play synthesized melody as reliable fallback
  const playSynthesizedMelody = useCallback(() => {
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;

      if (synthContextRef.current) {
        synthContextRef.current.close().catch(() => {});
      }

      const context = new AudioCtor();
      synthContextRef.current = context;

      const masterGain = context.createGain();
      masterGain.gain.value = 0.08;
      masterGain.connect(context.destination);

      let startAt = context.currentTime + 0.08;
      const noteLength = 0.28;

      melody.forEach((frequency) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(frequency, startAt);

        gainNode.gain.setValueAtTime(0.0001, startAt);
        gainNode.gain.exponentialRampToValueAtTime(0.2, startAt + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + noteLength);

        oscillator.connect(gainNode);
        gainNode.connect(masterGain);

        oscillator.start(startAt);
        oscillator.stop(startAt + noteLength + 0.04);

        startAt += noteLength * 0.94;
      });

      setIsPlaying(true);
    } catch (e) {
      console.warn('Synthesizer audio failed:', e);
    }
  }, []);

  const playBirthdaySong = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      const audio = new Audio('/birthday.mp3');
      audio.loop = true;
      audio.volume = 0.65;
      audioRef.current = audio;

      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('error', () => {
        // Fallback to secondary path or synthesized melody
        if (audio.src.endsWith('/birthday.mp3')) {
          audio.src = '/aud.mp3';
          audio.play().catch(() => playSynthesizedMelody());
        } else {
          playSynthesizedMelody();
        }
      });
    }

    const promise = audioRef.current.play();
    if (promise !== undefined) {
      promise
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.log('Audio autoplay prevented or error, falling back:', err.message);
          playSynthesizedMelody();
        });
    }
  }, [playSynthesizedMelody]);

  const pauseBirthdaySong = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (synthContextRef.current) {
      synthContextRef.current.close().catch(() => {});
      synthContextRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    } else {
      setIsMuted((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (synthContextRef.current) {
        synthContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return {
    isPlaying,
    isMuted,
    playBirthdaySong,
    pauseBirthdaySong,
    toggleMute,
  };
}
