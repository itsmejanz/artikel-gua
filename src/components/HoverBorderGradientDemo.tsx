"use client";
import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/router";


export function HoverBorderGradientDemo() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/blog");
  };
  return (
    <div className="mt-10 lg:pr-60 flex justify-center items-center ">
      <button onClick={handleClick} className="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-gray-800 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-gray-600/50 border border-white/20">
        <span className="text-lg">Go To Documentation</span>
        <FiArrowRight className="ml-4 text-lg" />
        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
          <div className="relative h-full w-10 bg-white/20"></div>
        </div>
      </button>
    </div>
  );
}
