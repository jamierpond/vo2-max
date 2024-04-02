import { useEffect, useRef } from 'react';

export function AudioAlert({ someCondition: shouldPlay, isHighIntensity }: { someCondition: boolean, isHighIntensity: boolean }) {
  const alertAudio = useRef<HTMLAudioElement | null>(null);
  const bellAudio = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    alertAudio.current = new Audio('/bell.mp3');
    bellAudio.current = new Audio('/alert.mp3');
  }, []);

  const playAlert = () => {
    if (!alertAudio.current || !bellAudio.current) {
      alert("Audio not loaded");
      return;
    }
    alertAudio.current?.pause();
    bellAudio.current?.pause();
    alertAudio.current.currentTime = 0;
    bellAudio.current.currentTime = 0;
    if (isHighIntensity) {
      alertAudio.current?.play();
    } else {
      bellAudio.current?.play();
    }
  };

  useEffect(() => {
    if (shouldPlay) {
      console.log("Playing alert");
      playAlert();
    }
  }, [shouldPlay]);

  return null;
};


