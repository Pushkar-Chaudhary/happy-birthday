import { useCallback, useEffect, useRef } from 'react';

const melody = [
  392.0, 392.0, 440.0, 392.0, 523.25, 493.88,
  392.0, 392.0, 440.0, 392.0, 587.33, 523.25,
  392.0, 392.0, 659.25, 523.25, 587.33, 523.25,
  493.88, 440.0, 659.25, 659.25, 587.33, 523.25,
  587.33, 659.25, 523.25, 392.0, 392.0, 440.0,
  392.0, 523.25, 493.88,
];

export function useBirthdaySong() {
  const startedRef = useRef(false);

  const playBirthdaySong = useCallback(() => {
    if (startedRef.current || typeof window === 'undefined') return;

    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;

    startedRef.current = true;

    const context = new AudioCtor();
    const masterGain = context.createGain();
    masterGain.gain.value = 0.055;
    masterGain.connect(context.destination);

    let startAt = context.currentTime + 0.08;
    const noteLength = 0.26;

    melody.forEach((frequency) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startAt);

      gainNode.gain.setValueAtTime(0.0001, startAt);
      gainNode.gain.exponentialRampToValueAtTime(0.18, startAt + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + noteLength);

      oscillator.connect(gainNode);
      gainNode.connect(masterGain);

      oscillator.start(startAt);
      oscillator.stop(startAt + noteLength + 0.03);

      startAt += noteLength * 0.92;
    });

    setTimeout(() => {
      context.close().catch(() => {});
    }, 5000);
  }, []);

  useEffect(() => {
    playBirthdaySong();

    const onUserAction = () => {
      playBirthdaySong();
    };

    document.addEventListener('pointerdown', onUserAction, { once: true });
    document.addEventListener('keydown', onUserAction, { once: true });

    return () => {
      document.removeEventListener('pointerdown', onUserAction);
      document.removeEventListener('keydown', onUserAction);
    };
  }, [playBirthdaySong]);

  return { playBirthdaySong };
}
