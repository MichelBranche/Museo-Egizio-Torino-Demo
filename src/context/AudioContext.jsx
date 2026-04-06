/* eslint-disable react-refresh/only-export-components -- hook accoppiato al provider audio globale */
import React, { createContext, useCallback, useContext, useRef } from 'react';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);

  const playAmbient = useCallback(() => {
    const el = audioRef.current;
    if (!el || !el.paused) return;
    el.play().catch(() => {});
  }, []);

  return (
    <AudioContext.Provider value={{ playAmbient, audioRef }}>
      <audio ref={audioRef} src="/hero_audio.mp3" loop preload="auto" className="hidden" aria-hidden />
      {children}
    </AudioContext.Provider>
  );
}

export function useAmbientAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAmbientAudio must be used within AudioProvider');
  }
  return ctx;
}
