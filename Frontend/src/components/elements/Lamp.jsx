"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../ui/lamp";

export function LampDemo() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="w-full bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center tracking-tight text-transparent"
      >
        <div className="flex gap-6 justify-center m-0 p-0">
          <div className=" max-w-sm p-6 bg-white/0 flex flex-col justify-center border border-gray-200 rounded-lg shadow dark:border-gray-700 backdrop-blur-xl">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
              Seamless Multi-OS Tracking
            </h5>
            <p className="font-normal text-gray-300 dark:text-gray-400">
              Track user activities effortlessly across Windows, macOS, and
              Linux.
            </p>
          </div>
          <div className=" max-w-sm p-6 bg-white/0 flex flex-col justify-center border border-gray-200 rounded-lg shadow dark:border-gray-700 backdrop-blur-xl">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
              Dynamic User Insights
            </h5>
            <p className="font-normal text-gray-300 dark:text-gray-400">
              Capture user behavior every 15 seconds for real-time analytics.
            </p>
          </div>
          <div className=" max-w-sm p-6 bg-white/0 flex flex-col justify-center border border-gray-200 rounded-lg shadow dark:border-gray-700 backdrop-blur-xl">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-white dark:text-white">
              Daily User Activity Summary
            </h5>
            <p className="font-normal text-gray-300 dark:text-gray-400">
              Send automated email reports to users every 24 hours.
            </p>
          </div>
        </div>
      </motion.h1>
    </LampContainer>
  );
}
