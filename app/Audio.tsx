import { useEffect, useRef } from 'react';

export function AudioAlert({ someCondition: shouldPlay, isHighIntensity }: { someCondition: boolean, isHighIntensity: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    const audioElement = new Audio(isHighIntensity ? '/alert.mp3' : '/bell.mp3');
    audioRef.current = audioElement;

    const context = new AudioContext();
    contextRef.current = context;

    const source = context.createMediaElementSource(audioElement);
    sourceRef.current = source;

    source.connect(context.destination);

    return () => {
      source.disconnect();
      context.close();
    };
  }, [isHighIntensity]);

  const playAlert = () => {
    if (!audioRef.current || !contextRef.current) {
      alert("Audio not loaded");
      return;
    }
    audioRef.current.currentTime = 0;
    contextRef.current.resume();
    audioRef.current.play();
  };

  useEffect(() => {
    if (shouldPlay) {
      console.log("Playing alert");
      playAlert();
    }
  }, [shouldPlay]);

  return null;
};
