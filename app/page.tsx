"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTimer } from "react-use-precision-timer";
import { progressImageSvgString } from "./Drawing";
import { AudioAlert } from "./Audio";

const FRAME_RATE_HZ = 30;
const NUM_MS_PER_FRAME = 1000 / FRAME_RATE_HZ;
const HIGH_INTENSITY_DURATION_SECONDS = process.env.NODE_ENV === "development" ? 3 : 60;
const LOW_INTENSITY_DURATION_SECONDS = process.env.NODE_ENV === "development" ? 3 : 3 * 60;
const TOTAL_NUM_ROUNDS = 4;
const NUM_FRAMES_HIGH_INTENSITY = HIGH_INTENSITY_DURATION_SECONDS * FRAME_RATE_HZ;
const NUM_FRAMES_LOW_INTENSITY = LOW_INTENSITY_DURATION_SECONDS * FRAME_RATE_HZ;

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [isHighIntensity, setIsHighIntensity] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [numRoundsCompleted, setNumRoundsCompleted] = useState(0);

  function onTranitionToHighIntensity() {}
  function onTransitionToLowIntensity() {
    setNumRoundsCompleted((prevNumRoundsCompleted) => {
      if (prevNumRoundsCompleted + 1 >= TOTAL_NUM_ROUNDS) {
        return TOTAL_NUM_ROUNDS;
      }
      return prevNumRoundsCompleted + 1;
    });
  }

  function timerCallback() {
    if (!isPaused) {
      setFrameCount((prevFrameCount) => prevFrameCount + 1);
      setTotalFrames((prevTotalFrames) => prevTotalFrames + 1);
    }
  }
  const timer = useTimer({ delay: NUM_MS_PER_FRAME }, timerCallback);
  useEffect(() => {
    timer.start();
    return () => timer.stop();
  }, []);

  useEffect(() => {
    const frames = isHighIntensity ? NUM_FRAMES_HIGH_INTENSITY : NUM_FRAMES_LOW_INTENSITY;
    setProgress((frameCount / frames) * 100);
    if (frameCount >= frames) {
      setIsHighIntensity((prevIsHighIntensity) => !prevIsHighIntensity);
      setFrameCount(0);
      if (isHighIntensity) {
        onTranitionToHighIntensity();
      } else {
        onTransitionToLowIntensity();
      }
    }
  }, [frameCount, isHighIntensity]);

  const handleClick = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  const image = progressImageSvgString(progress, 250, 250, isHighIntensity);

  const duration = isHighIntensity ? HIGH_INTENSITY_DURATION_SECONDS : LOW_INTENSITY_DURATION_SECONDS;
  const timeRemaining = duration - Math.floor(frameCount / FRAME_RATE_HZ);
  const timeRemainingString = `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`;
  const totalTime = Math.floor(totalFrames / FRAME_RATE_HZ);
  const totalTimeString = `Total Time: ${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}`;

  const roundText = numRoundsCompleted === TOTAL_NUM_ROUNDS
    ? "Workout Complete!"
    : `Round ${numRoundsCompleted + 1} of ${TOTAL_NUM_ROUNDS}`;

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-8"
      onClick={handleClick}
    >
      <div className="flex flex-col items-center">
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(image)}`}
          width={250}
          height={250}
          alt="Progress Image"
        />
        <h1 className="text-4xl mt-8 font-bold">
          {timeRemainingString}
        </h1>
        <p className="text-xl mt-2">
          {isHighIntensity ? "High Intensity" : "Low Intensity"}
        </p>
        <p className="text-lg mt-4">
          {roundText}
        </p>
        {isPaused && (
          <p className="text-2xl mt-4 text-red-500">Paused</p>
        )}
        <p className="text-sm mt-4 text-gray-500">
          {totalTimeString}
        </p>
        <AudioAlert someCondition={frameCount === 0 && !isPaused} isHighIntensity={!isHighIntensity} />
      </div>
    </main>
  );
}
