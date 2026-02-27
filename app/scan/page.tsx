"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const fingers = [
  "Left Thumb",
  "Left Index",
  "Left Middle",
  "Left Ring",
  "Left Pinky",
  "Right Thumb",
  "Right Index",
  "Right Middle",
  "Right Ring",
  "Right Pinky",
];

export default function Scan() {
  const [step, setStep] = useState(0);
  const [captures, setCaptures] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();
  }, []);

const captureImage = () => {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const MAX_WIDTH = 500;
const scale = MAX_WIDTH / video.videoWidth;

canvas.width = MAX_WIDTH;
canvas.height = video.videoHeight * scale;

context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/jpeg", 0.7);

  // Save this finger
  const newCaptures = [...captures, imageData];
  setCaptures(newCaptures);

  // If more fingers left → next finger
  if (step < fingers.length - 1) {
    setStep(step + 1);
  } else {
    // All fingers done → store and go to results
    sessionStorage.setItem("allScans", JSON.stringify(newCaptures));
    router.push("/results");
  }
};

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-6 flex flex-col items-center">
      
      <h1 className="text-3xl font-serif mb-2 text-center">
        Scan Your Nail
      </h1>

      <p className="text-sm mb-6 text-center text-gray-600">
        Step {step + 1} of 10
      </p>

      {/* Camera Container */}
      <div className="relative w-72 h-[420px] rounded-3xl overflow-hidden border border-[#E5D6CF]">

        {/* Camera */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        <canvas ref={canvasRef} className="hidden" />

        {/* QR Guide */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <p className="text-xs mb-1 text-white bg-black/40 px-2 py-1 rounded">
            QR here
          </p>

          <div className="w-20 h-20 border-2 border-dashed border-white rounded-lg" />
        </div>

        {/* Finger Guide */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
          
          <p className="text-xs mb-2 text-white bg-black/40 px-2 py-1 rounded">
            {fingers[step]}
          </p>

          <div className="w-40 h-56 border-2 border-white rounded-full" />
        </div>

      </div>

      <p className="mt-6 mb-8 text-center max-w-sm text-sm">
        Rest your finger over the edge of a table so your nail faces the camera.
        Keep your hand flat and steady.
      </p>

      <button
        onClick={captureImage}
        className="px-6 py-3 rounded-full bg-[#C8B1A6] text-white"
      >
        Capture
      </button>

    </main>
  );
}