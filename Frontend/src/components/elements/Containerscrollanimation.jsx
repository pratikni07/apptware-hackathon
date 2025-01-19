"use client";
import React from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import LpImg from "../../assets/image.png";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden ">
      <ContainerScroll
      // titleComponent={
      //   <>
      //     <h1 className="text-4xl font-semibold text-black dark:text-white mt-0 mb-16">
      //       Unleash the power of <br />
      //       <span className="text-4xl md:text-[3rem] font-bold mt-4 leading-none">
      //         Scroll Animations
      //       </span>
      //     </h1>
      //   </>
      // }
      >
        <img
          src={LpImg}
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
