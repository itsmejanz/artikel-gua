"use client";
import React from "react";
import { motion } from "framer-motion";
import { LinkPreview } from "@/components/ui/link-preview";

export function LinkPreviewDemo() {
  return (
    <div className="flex justify-center items-center mt-5 -ml-8  flex-col z-[999]">
      <p className="text-neutral-500 dark:text-neutral-400 text-md md:text-3xl max-w-3xl mx-auto mb-10">
        Follow me on{" "}
        <LinkPreview
          url="https://www.tiktok.com/@ahmadafriza25"
          className="font-bold"
        >
          Tiktok
        </LinkPreview>{" "}
        and{" "}
        <span>
          <LinkPreview
            url="https://www.youtube.com/channel/UCGI119S5iGHHMgBXRCKVG8g"
            className="font-bold text-red-600"
          >
            Youtube
          </LinkPreview>
        </span>
      </p>
    </div>
  );
}
