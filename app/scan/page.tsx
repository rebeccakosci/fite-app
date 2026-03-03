"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const fingers = [
  "Left Thumb",
  "Left Index",
  "Left Middle",
  "Left Ring",
  "Left Pinky",
];

const demoWidths = [17.1, 13.9, 14.6, 13.7, 11.3];

export default function Scan() {
  const [step, setStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [capturedCurrent, setCapturedCurrent] = useState(false);
  const [capturedWidths, setCapturedWidths] = useState<number[]>([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch {
        setCameraError(true);
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleScanFinger = () => {
    if (isScanning || capturedCurrent) return;
    setIsScanning(true);

    setTimeout(() => {
      setCapturedWidths((prev) => [...prev, demoWidths[step]]);
      setCapturedCurrent(true);
      setIsScanning(false);
    }, 700);
  };

  const handleNext = () => {
    if (!capturedCurrent) return;

    if (step < fingers.length - 1) {
      setStep((prev) => prev + 1);
      setCapturedCurrent(false);
      return;
    }

    sessionStorage.setItem("nailWidths", JSON.stringify(capturedWidths));
    sessionStorage.setItem("allScans", JSON.stringify(Array(fingers.length).fill("demo-scan")));
    router.push("/results");
  };

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-serif mb-2 text-center">Scan Your Nail</h1>

      <p className="text-sm mb-2 text-center text-gray-600">Step {step + 1} of {fingers.length}</p>
      <p className="text-xs mb-6 text-center text-[#8A7D76] uppercase tracking-[0.12em]">
        Demo Scan Mode
      </p>

      <div className="relative w-80 h-[520px] rounded-3xl overflow-hidden border border-[#E5D6CF] bg-gradient-to-b from-[#EEDFD8] to-[#DCC6BD]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover ${cameraReady ? "block" : "hidden"}`}
        />

        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#EEDFD8] to-[#DCC6BD]">
            <p className="text-sm text-[#6E625C]">
              {cameraError ? "Camera unavailable" : "Starting camera..."}
            </p>
          </div>
        )}

        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-xs font-medium text-[#6E625C] bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            QR Code
          </p>
          <div className="w-20 h-20 border-2 border-dashed border-white rounded-lg" />
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="relative w-36 h-56 rounded-full border border-[#E5D6CF] flex items-center justify-center shadow-[0_0_20px_rgba(200,177,166,0.25)]">
            <p className="text-xs font-medium text-[#6E625C] bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
              {fingers[step]}
            </p>
          </div>
        </div>

        <div
          className="absolute inset-y-0 left-0 bg-white/15"
          style={{
            width: `${(capturedWidths.length / fingers.length) * 100}%`,
            transition: "width 280ms ease",
          }}
        />
      </div>

      <p className="mt-6 mb-4 text-center max-w-sm text-sm">
        Rest your finger over the edge of a table so your nail faces the camera. Keep your hand flat and steady.
      </p>

      {capturedCurrent && step < fingers.length - 1 && (
        <p className="text-sm text-[#6E625C] mb-3 text-center">
          Finger captured. Next finger: {fingers[step + 1]}.
        </p>
      )}

      {capturedCurrent && step === fingers.length - 1 && (
        <p className="text-sm text-[#6E625C] mb-3 text-center">
          Final finger captured. Continue to your results.
        </p>
      )}

      {!capturedCurrent ? (
        <button
          onClick={handleScanFinger}
          disabled={isScanning}
          className={`px-6 py-3 rounded-full text-white ${
            isScanning ? "bg-[#B9A399]" : "bg-[#C8B1A6]"
          }`}
        >
          {isScanning ? "Scanning..." : "Scan Finger"}
        </button>
      ) : (
        <button
          onClick={handleNext}
          className="px-6 py-3 rounded-full text-white bg-[#C8B1A6]"
        >
          {step === fingers.length - 1 ? "View Results" : "Next Finger"}
        </button>
      )}
    </main>
  );
}
