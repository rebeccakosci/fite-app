"use client";

import { useEffect, useState } from "react";

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

export default function Results() {
  const [loading, setLoading] = useState(true);
  const [sizes, setSizes] = useState<number[]>([]);

  useEffect(() => {
    // Simulate analysis delay
    setTimeout(() => {
      // Fake sizes for now (we replace later with real measurement)
      const fakeSizes = fingers.map(() =>
        Math.floor(Math.random() * 10)
      );

      setSizes(fakeSizes);
      setLoading(false);
    }, 2500);
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F4EF] text-[#2B2B2B] p-6 flex flex-col items-center justify-center">
      
      {loading ? (
        <>
          <h1 className="text-3xl font-serif mb-4 text-center">
            Analyzing Your Nails
          </h1>

          <div className="w-12 h-12 border-4 border-[#C8B1A6] border-t-transparent rounded-full animate-spin mb-6" />

          <p className="text-center max-w-sm">
            Finding your perfect fit…
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-serif mb-6 text-center">
            Your Perfect Fit
          </h1>

          <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-md">
            {sizes.map((size, i) => (
              <div
                key={i}
                className="flex justify-between py-2 border-b last:border-none"
              >
                <span>{fingers[i]}</span>
                <span className="font-semibold">Size {size}</span>
              </div>
            ))}
          </div>
        </>
      )}

    </main>
  );
}