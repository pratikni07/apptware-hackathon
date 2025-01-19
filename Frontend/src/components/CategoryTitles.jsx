import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Sector,
} from "recharts";

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

const generatePastelColor = () => {
  // Generate pastel colors that maintain readability with white text
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * (85 - 65) + 65); // 65-85%
  const lightness = Math.floor(Math.random() * (65 - 55) + 55); // 55-65%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 4}
        outerRadius={outerRadius + 8}
        fill={fill}
      />
    </g>
  );
};

const CategoryTitles = ({ windowData = [] }) => {
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  if (!windowData || windowData.length === 0) {
    return (
      <div className="text-center p-4 text-gray-400">
        No data available for this operating system
      </div>
    );
  }

  const displayedApps = showAll ? windowData : windowData?.slice(0, 5);

  const chartData = displayedApps.map((app) => ({
    name: app.category,
    value: getTimeInSeconds(app.totalTime.formatted),
    timeFormatted: app.totalTime.formatted,
  }));

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 p-2 rounded shadow">
          <p className="text-white">{data.name}</p>
          <p className="text-gray-300">{data.timeFormatted}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="h-64">
        {" "}
        {/* Reduced height from h-96 to h-64 */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              innerRadius="55%"
              outerRadius="75%"
              paddingAngle={4}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={generatePastelColor()} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {windowData?.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 flex items-center justify-center py-2 px-2 text-gray-400 hover:text-white transition-colors border border-gray-400 hover:border-white rounded-lg w-full"
        >
          Show {showAll ? "less" : "more"}
          {showAll ? (
            <ChevronUp className="ml-2" />
          ) : (
            <ChevronDown className="ml-2" />
          )}
        </button>
      )}
    </div>
  );
};

export default CategoryTitles;
