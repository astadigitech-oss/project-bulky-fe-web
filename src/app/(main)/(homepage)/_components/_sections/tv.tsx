import { PlayCircle } from "lucide-react";
import React from "react";

export const TVSection = () => {
  return (
    <section className="bg-linear-to-b from-yellow-400 from-50% to-50% to-yellow-400/0 w-full">
      <div className="xl:max-w-7xl max-w-5xl w-full mx-auto px-17 pb-32 py-13 z-10 flex flex-col gap-9">
        <p className="text-center font-black text-4xl">BULKY TV</p>
        <div className="grid grid-cols-4 gap-6 ">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl aspect-5/7 p-2 shadow"
            >
              <div className="size-full bg-gray-300 rounded-lg flex items-center justify-center">
                <PlayCircle className="size-12 stroke-[1.25]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
