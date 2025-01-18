import React, { useEffect, useRef, useState } from "react";
import * as d3 from "recharts";

const AnimationSunburst = () => {
  const [hoveredPath, setHoveredPath] = useState(null);

  // Data structure matching the "Top Categories" image
  const data = {
    name: "Total",
    children: [
      {
        name: "Uncategorized",
        value: 297, // 4h 57m 8s in seconds
        color: "#4B5563",
      },
      {
        name: "Work",
        children: [
          {
            name: "Programming",
            children: [
              {
                name: "ActivityWatch",
                value: 287, // 4m 47s in seconds
                color: "#22C55E",
              },
            ],
          },
        ],
      },
      {
        name: "Media",
        children: [
          {
            name: "Video",
            value: 227, // 37m 42s in seconds
            color: "#EF4444",
          },
        ],
      },
      {
        name: "Work General",
        value: 578, // 9m 38s in seconds
        color: "#22C55E",
      },
      {
        name: "Comms",
        children: [
          {
            name: "IM",
            value: 111, // 1m 51s in seconds
            color: "#0EA5E9",
          },
        ],
      },
    ],
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <>
      {/* Main visualization container */}
      <div className="relative w-full aspect-square">
        <svg className="w-full h-full" viewBox="0 0 400 400">
          {/* Center circle with stats */}
          <g transform="translate(200, 200)">
            {/* Animated circle background */}
            <circle r="80" fill="#1F2937" className="animate-pulse" />

            {/* Center text */}
            <text
              y="-20"
              textAnchor="middle"
              className="fill-gray-100 text-lg font-medium"
            >
              Total Time
            </text>
            <text
              y="10"
              textAnchor="middle"
              className="fill-gray-100 text-2xl font-bold"
            >
              4h 57m
            </text>
            <text y="35" textAnchor="middle" className="fill-gray-300 text-sm">
              8 Categories
            </text>
          </g>

          {/* Arc segments */}
          {data.children.map((category, i) => {
            const angle = (2 * Math.PI * category.value) / 1500;
            const startAngle = i * angle;
            return (
              <g key={category.name} className="transition-all duration-300">
                <path
                  d={`M 200,200 
                       L ${200 + 150 * Math.cos(startAngle)},${
                    200 + 150 * Math.sin(startAngle)
                  } 
                       A 150,150 0 0,1 ${
                         200 + 150 * Math.cos(startAngle + angle)
                       },${200 + 150 * Math.sin(startAngle + angle)} 
                       Z`}
                  fill={category.color || "#4B5563"}
                  className={`transition-all duration-300 hover:opacity-90 cursor-pointer
                              ${
                                hoveredPath === category.name
                                  ? "scale-105"
                                  : "opacity-80"
                              }`}
                  onMouseEnter={() => setHoveredPath(category.name)}
                  onMouseLeave={() => setHoveredPath(null)}
                >
                  <animate
                    attributeName="d"
                    dur="1s"
                    fill="freeze"
                    from={`M 200,200 L 200,200 A 0,0 0 0,1 200,200 Z`}
                    to={`M 200,200 
                          L ${200 + 150 * Math.cos(startAngle)},${
                      200 + 150 * Math.sin(startAngle)
                    } 
                          A 150,150 0 0,1 ${
                            200 + 150 * Math.cos(startAngle + angle)
                          },${200 + 150 * Math.sin(startAngle + angle)} 
                          Z`}
                  />
                </path>
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredPath && (
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2
                         bg-gray-800 text-white p-3 rounded-lg shadow-lg
                         animate-fade-in transition-all duration-200"
          >
            <div className="font-medium">{hoveredPath}</div>
            <div className="text-sm text-gray-300 mt-1">
              {formatTime(
                data.children.find((c) => c.name === hoveredPath)?.value || 0
              )}
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8 w-full max-w-md">
        {data.children.map((category) => (
          <div
            key={category.name}
            className={`flex items-center space-x-2 transition-all duration-200
                         ${
                           hoveredPath === category.name
                             ? "opacity-100"
                             : "opacity-80"
                         }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color || "#4B5563" }}
            />
            <span className="text-gray-200 text-sm">
              {category.name} ({formatTime(category.value)})
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default AnimationSunburst;
