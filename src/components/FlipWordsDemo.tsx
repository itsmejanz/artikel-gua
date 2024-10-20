import React from "react";
import { FlipWords } from "@/components/ui/flip-words";

export function FlipWordsDemo() {
  const words = ["better", "easy", "beautiful", "modern", "fast", "powerful"];

  return (
    <div className=" flex justify-center items-center px-4">
      <div className="text-4xl  lg:text-5xl mx-auto font-bold text-neutral-600 dark:text-neutral-400">
        Build
        <FlipWords words={words} /> <br />
        websites with Zacode
      </div>
    </div>
  );
}
