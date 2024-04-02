"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const FRAME_RATE_HZ = 30;
const NUM_MS_PER_FRAME = 1000 / FRAME_RATE_HZ;
const HIGH_INTENSITY_DURATION_SECONDS = 60; // 1 minute in seconds
const LOW_INTENSITY_DURATION_SECONDS = 3 * 60; // 3 minutes in seconds

const NUM_FRAMES_HIGH_INTENSITY = HIGH_INTENSITY_DURATION_SECONDS * FRAME_RATE_HZ;
const NUM_FRAMES_LOW_INTENSITY = LOW_INTENSITY_DURATION_SECONDS * FRAME_RATE_HZ;

function getFirePath(
  centerX: number,
  centerY: number,
  radius: number,
  lineWidth: number,
): string {
  const fireWidth = radius * 0.6;
  const fireHeight = radius * 0.8;
  const fireLeft = centerX - fireWidth / 2;
  const fireTop = centerY - fireHeight / 2;

  return `<path d="M${fireLeft},${fireTop + fireHeight * 0.7}
    Q${fireLeft + fireWidth * 0.4},${fireTop + fireHeight * 0.4} ${fireLeft + fireWidth / 2},${fireTop}
    Q${fireLeft + fireWidth * 0.6},${fireTop + fireHeight * 0.4} ${fireLeft + fireWidth},${fireTop + fireHeight * 0.7}
    Q${fireLeft + fireWidth * 0.7},${fireTop + fireHeight} ${fireLeft + fireWidth / 2},${fireTop + fireHeight}
    Q${fireLeft + fireWidth * 0.3},${fireTop + fireHeight} ${fireLeft},${fireTop + fireHeight * 0.7}
    Z" fill="#FF5722" stroke="white" stroke-width="${lineWidth * 0.2}"/>`;
}

function getSnowflakePath(
  centerX: number,
  centerY: number,
  radius: number,
  lineWidth: number,
): string {
  const snowflakeSize = radius * 0.6;
  const snowflakeLeft = centerX - snowflakeSize / 2;
  const snowflakeTop = centerY - snowflakeSize / 2;

  return `<path d="M${centerX},${snowflakeTop}
    L${centerX},${snowflakeTop + snowflakeSize}
    M${snowflakeLeft},${centerY}
    L${snowflakeLeft + snowflakeSize},${centerY}
    M${snowflakeLeft + snowflakeSize * 0.3},${snowflakeTop + snowflakeSize * 0.3}
    L${snowflakeLeft + snowflakeSize * 0.7},${snowflakeTop + snowflakeSize * 0.7}
    M${snowflakeLeft + snowflakeSize * 0.3},${snowflakeTop + snowflakeSize * 0.7}
    L${snowflakeLeft + snowflakeSize * 0.7},${snowflakeTop + snowflakeSize * 0.3}"
    stroke="#2196F3" stroke-width="${lineWidth * 0.2}" fill="none"/>`;
}

function progressImageSvgString(
  amount: number,
  width: number,
  height: number,
  isHighIntensity: boolean = true
): string {
  const lineWithRatio = 0.1;
  const lineWidth = Math.min(width, height) * lineWithRatio;
  const radius = Math.min(width, height) / 2 - lineWidth;
  const centerX = width / 2;
  const centerY = height / 2;

  const backgroundCircle = `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="#ddd" stroke-width="${lineWidth}" fill="black"/>`;

  const fullCircle = 2 * Math.PI * radius;
  const progressLength = (amount / 100) * fullCircle;
  const offset = fullCircle - progressLength;

  const color = isHighIntensity ? "#FF5722" : "#2196F3";

  const foregroundCircle = `<circle cx="${centerX}" cy="${centerY}" r="${radius}" stroke="${color}" stroke-width="${lineWidth}" fill="none"
    stroke-dasharray="${fullCircle}" stroke-dashoffset="${offset}" transform="rotate(-90 ${centerX} ${centerY})"/>`;

  const centreIcon = isHighIntensity
    ? getFirePath(centerX, centerY, radius, lineWidth)
    : getSnowflakePath(centerX, centerY, radius, lineWidth);

  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    ${backgroundCircle}
    ${foregroundCircle}
    ${centreIcon}
  </svg>`;

  return svg;
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [isHighIntensity, setIsHighIntensity] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameCount((prevFrameCount) => prevFrameCount + 1);
      setTotalFrames((prevTotalFrames) => prevTotalFrames + 1);
    }, NUM_MS_PER_FRAME);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const frames = isHighIntensity ? NUM_FRAMES_HIGH_INTENSITY : NUM_FRAMES_LOW_INTENSITY;
    setProgress((frameCount / frames) * 100);
    if (frameCount >= frames) {
      setIsHighIntensity((prevIsHighIntensity) => !prevIsHighIntensity);
      setFrameCount(0);
    }
  }, [frameCount, isHighIntensity]);

  const image = progressImageSvgString(progress, 250, 250, isHighIntensity);

  const duration = isHighIntensity ? HIGH_INTENSITY_DURATION_SECONDS : LOW_INTENSITY_DURATION_SECONDS;
  const timeRemaining = duration - Math.floor(frameCount / FRAME_RATE_HZ);
  const timeRemainingString = `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`;
  const totalTime = Math.floor(totalFrames / FRAME_RATE_HZ);
  const totalTimeString = `Total Time: ${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, '0')}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
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
        <p className="text-sm mt-4 text-gray-500">
          {totalTimeString}
        </p>
      </div>
    </main>
  );
}
