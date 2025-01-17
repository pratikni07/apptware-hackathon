import React, { useState } from "react";
import { ChevronDown, ArrowUpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

const WindowTitles = () => {
  const [showAll, setShowAll] = useState(false);

  const titles = [
    { title: "ActivityWatch - Google Chrome", time: "14m 42s" },
    { title: "ChatGPT - Google Chrome", time: "14m 2s" },
    {
      title: "Watch Bigg Boss Season 18 Episode 102 : Gharwalon",
      time: "13m 58s",
    },
    {
      title: "ActivityWatch/activitywatch: The best free and open-so",
      time: "8m 16s",
    },
    { title: "codecraft - Google Docs - Google Chrome", time: "6m 58s" },
    {
      title: "Plant Leaf Disease Detection GUI | Machine Learning",
      time: "4m 47s",
    },
    {
      title: "Rulebook_-_CodeCraft_2025[1].pdf - Personal - Micro",
      time: "4m 27s",
    },
    {
      title: "Watch Bigg Boss Season 18 Episode 103 : BB Journe",
      time: "4m 25s",
    },
    { title: "", time: "4m 18s" },
    {
      title: "plant disease detection app project - YouTube - Brave",
      time: "4m 15s",
    },
  ];

  // Convert time string to seconds for comparison
  const getSeconds = (timeStr) => {
    const [min, sec] = timeStr.replace(/[ms]/g, "").split(" ");
    return parseInt(min) * 60 + parseInt(sec);
  };

  // Find the maximum time to calculate relative widths
  const maxSeconds = Math.max(...titles.map((t) => getSeconds(t.time)));

  // Determine color based on time groups
  const getColor = (timeStr) => {
    const seconds = getSeconds(timeStr);
    if (seconds > maxSeconds * 0.7) return "bg-green-500";
    if (seconds > maxSeconds * 0.3) return "bg-gray-300";
    return "bg-red-400";
  };

  const visibleTitles = showAll ? titles : titles.slice(0, 6);

  return (
    <Card className="w-full max-w-2xl p-4 bg-white shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Top Window Titles</h2>
      <ScrollArea className="h-full">
        <div className="space-y-2">
          {visibleTitles.map((item, index) => (
            <div
              key={index}
              className="relative h-12 bg-gray-100 rounded-md overflow-hidden"
            >
              <div
                className={`absolute top-0 bottom-0 left-0 ${getColor(
                  item.time
                )}`}
                style={{
                  width: `${(getSeconds(item.time) / maxSeconds) * 100}%`,
                  transition: "width 0.3s ease-in-out",
                }}
              />
              <div className="relative h-full px-4 py-2 flex justify-between items-center">
                <span className="text-sm truncate flex-1">{item.title}</span>
                <span className="text-sm text-gray-600 ml-2">{item.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2"
          >
            <ChevronDown className="h-4 w-4" />
            Show {showAll ? "less" : "more"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowUpCircle className="h-4 w-4" />
          </Button>
        </div>
      </ScrollArea>
    </Card>
  );
};

export default WindowTitles;
