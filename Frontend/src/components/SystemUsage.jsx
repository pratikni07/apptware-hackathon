import React, { useState } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import { X } from "lucide-react";

const generatePastelColor = (baseHue) => {
  // Generate pastel colors that maintain readability with white text
  const saturation = Math.floor(Math.random() * (85 - 65) + 65); // 65-85%
  const lightness = Math.floor(Math.random() * (65 - 55) + 55); // 55-65%
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};

const SystemUsage = ({ metricData, activeOS }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Transform the metric data into the format needed for the charts
  const formattedMetrics = [
    {
      name: "CPU",
      value: metricData.cpu || 0,
      fill: generatePastelColor(120), // Green base hue
    },
    {
      name: "Memory",
      value: metricData.memory || 0,
      fill: generatePastelColor(210), // Blue base hue
    },
    {
      name: "Disk",
      value: metricData.disk || 0,
      fill: generatePastelColor(45), // Amber base hue
    },
  ];

  if (!metricData) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-400 text-sm bg-zinc-800/50 rounded-lg">
        No data available for this operating system
      </div>
    );
  }

  return (
    <div className="z-10">
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 bg-gray-800 text-gray-100 rounded-md 
          hover:bg-gray-700 transition-colors shadow-lg
          animate-pulse hover:animate-none
          ring-2 ring-gray-700 hover:ring-blue-500
          hover:shadow-blue-500/20 hover:shadow-lg
          text-sm font-medium"
      >
        Check System Usage
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="p-4 bg-[#1c1c1c] rounded-lg shadow-2xl w-full max-w-2xl relative border border-gray-800">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center text-white">
              System Usage of {activeOS}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formattedMetrics.map((metric) => (
                <div
                  key={metric.name}
                  className="bg-gray-800/50 rounded-lg p-3 flex flex-col items-center
                    hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="h-[140px] w-[140px] relative flex items-center justify-center">
                    <RadialBarChart
                      width={140}
                      height={140}
                      cx={70}
                      cy={70}
                      innerRadius={45}
                      outerRadius={60}
                      barSize={8}
                      data={[metric]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        angleAxisId={0}
                        tick={false}
                      />
                      <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={30}
                        fill={metric.fill}
                      />
                      <text
                        x={70}
                        y={70}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-gray-100 font-bold text-xl"
                      >
                        {metric.value.toFixed(1)}%
                      </text>
                    </RadialBarChart>
                  </div>
                  <div className="text-gray-300 font-medium text-sm mt-1">
                    {metric.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemUsage;
