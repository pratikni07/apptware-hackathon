import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

// Sample data
const applications = [
  { name: "chrome.exe", time: "3h 39m 4s" },
  { name: "Code.exe", time: "1h 29m 7s" },
  { name: "brave.exe", time: "56m 50s" },
  { name: "explorer.exe", time: "11m 35s" },
  { name: "msedge.exe", time: "4m 28s" },
  { name: "spotify.exe", time: "2m 15s" },
  { name: "discord.exe", time: "1m 30s" },
];

const getTimeInSeconds = (timeStr) => {
  const parts = timeStr.split(" ");
  let seconds = 0;
  parts.forEach((part) => {
    if (part.includes("h")) seconds += parseInt(part) * 3600;
    if (part.includes("m")) seconds += parseInt(part) * 60;
    if (part.includes("s")) seconds += parseInt(part);
  });
  return seconds;
};

const getWidthPercentage = (timeStr) => {
  const seconds = getTimeInSeconds(timeStr);
  const maxSeconds = getTimeInSeconds("4h 0m 0s"); // Adjust this threshold as needed
  return Math.min((seconds / maxSeconds) * 100, 100);
};

// Utility function to generate random colors
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Titles = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedApps = showAll ? applications : applications.slice(0, 5);

  return (
    <>
      <div className="space-y-2">
        {displayedApps.map((app, index) => {
          const progressWidth = getWidthPercentage(app.time);
          const baseColor = generateRandomColor();
          return (
            <div key={index} className="relative rounded-lg overflow-hidden">
              {/* Static filled portion */}
              <div
                className="absolute top-0 left-0 h-full rounded-lg"
                style={{
                  width: `${progressWidth}%`,
                  backgroundColor: baseColor,
                  overflow: "hidden",
                }}
              >
                {/* Animated gradient effect */}
                <motion.div
                  className="h-full w-full"
                  style={{
                    background: `linear-gradient(90deg, rgba(255,255,255,0.2) 25%, rgba(0,0,0,0.2) 50%, rgba(255,255,255,0.2) 75%)`,
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "200% 0%"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </div>
              {/* Content */}
              <div className="relative p-2 flex justify-between items-center text-white">
                <span className="text-sm">{app.name}</span>
                <span className="text-xs text-gray-400">{app.time}</span>
              </div>
            </div>
          );
        })}
      </div>
      {applications.length > 5 && (
        <div className="flex">
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-2 flex items-center justify-center py-3 px-2 text-gray-400 hover:text-white transition-colors border border-gray-400 hover:border-white rounded-lg"
          >
            <span className="mr-1">Show {showAll ? "less" : "more"}</span>
            {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </>
  );
};

export default Titles;
