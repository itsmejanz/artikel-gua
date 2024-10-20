import localFont from "next/font/local";
import { renderCanvas } from "../Theme/renderCanvas";
import { useEffect } from "react";
import { useContext, useRef } from "react";
import { ScrollContext } from "@/Theme/ScrollProvider";
import Lanyard from "@/components/Lanyard";
import { FlipWordsDemo } from "@/components/FlipWordsDemo";
import { HoverBorderGradientDemo } from "@/components/HoverBorderGradientDemo";
import { LinkPreviewDemo } from "@/components/LinkPreviewDemo";
import PopupCard from "@/components/Popup";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const ref = useRef<HTMLHeadingElement>(null);
  const { scrollY } = useContext(ScrollContext);
  let progress = 0;
  const { current: elContainer } = ref;

  if (elContainer) {
    progress = Math.min(1, scrollY / elContainer.clientHeight);
  }

  useEffect(() => {
    renderCanvas();
  }, []);
  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <PopupCard/>
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0"
        id="canvas"
      ></canvas>
      <div className="w-full grid lg:grid-cols-2 grid-cols-1 mt-[400px] lg:mt-52">
       

        {/* kiri */}
        <div className="mt-40 flex flex-col">
          <FlipWordsDemo />
          <HoverBorderGradientDemo/>
          <LinkPreviewDemo/>
        </div>

         {/* kanan */}
         <div className="h-[450px] hidden lg:block">
          <Lanyard />
        </div>
      </div>
    </div>
  );
}
