import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { 
  Play,
  Share2,
  Code,
  Briefcase,
  Globe,
  Gamepad2,
  GraduationCap,
  Wallet,
  Heart,
  Settings,
  MessageSquare,
  HelpCircle
} from "lucide-react";

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
  const maxSeconds = getTimeInSeconds("4h 0m 0s");
  return Math.min((seconds / maxSeconds) * 100, 100);
};

const generatePastelColor = () => {
  // Generate pastel colors by using high lightness values
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
};

function getCategoryIcon(category) {
  const icons = {
    entertainment: <Play className="w-5 h-5" />,
    social_media: <Share2 className="w-5 h-5" />,
    coding: <Code className="w-5 h-5" />,
    productivity: <Briefcase className="w-5 h-5" />,
    browser: <Globe className="w-5 h-5" />,
    gaming: <Gamepad2 className="w-5 h-5" />,
    education: <GraduationCap className="w-5 h-5" />,
    finance: <Wallet className="w-5 h-5" />,
    health: <Heart className="w-5 h-5" />,
    utilities: <Settings className="w-5 h-5" />,
    communication: <MessageSquare className="w-5 h-5" />,
    other: <HelpCircle className="w-5 h-5" />
  };

  return icons[category] || icons["other"];
}

const Titles = ({ windowData = [] }) => {
  
  const [showAll, setShowAll] = useState(false);
  const displayedApps = showAll ? windowData : windowData?.slice(0, 5);

  console.log("dispalyed", displayedApps);

  if (!windowData || windowData.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 text-sm bg-zinc-800/50 rounded-lg">
        No data available for this operating system
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {displayedApps?.map((app, index) => {
          const progressWidth = getWidthPercentage(app?.duration?.formatted);
          return (
            <div key={index} className="relative rounded-lg overflow-hidden">

              {/* <div className="flex items-center bg-white">
                <img
                  src={getCategoryIcon(app?.category)}
                  alt={app?.category}
                  className="w-2 h-2 mr-2"
                />
                <span className="text-xs text-gray-400">{app?.category}</span>
              </div> */}
              <div
                className="absolute top-0 left-0 h-full rounded-lg"
                style={{
                  width: `${progressWidth}%`,
                  backgroundColor: generatePastelColor(),
                }}
              />
              <div className="relative p-2 flex justify-between items-center text-white">
              {/* <img
                  src={getCategoryIcon(app?.category)}
                  alt={app?.category}
                  className="w-6 h-6 mr-2"
                /> */}
                <span className="mr-3 flex-shrink-0 text-white ">
                    {getCategoryIcon(app?.category)}
                  </span>
                <span className="text-sm truncate whitespace-nowrap overflow-hidden flex-1 pr-4">
                  {app?.window}
                </span>
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                  {app?.duration?.formatted}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {windowData?.length > 5 && (
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
