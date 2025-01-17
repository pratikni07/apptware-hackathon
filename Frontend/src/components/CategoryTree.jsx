import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const CategoryTree = () => {
  const [showPercent, setShowPercent] = useState(false);
  const [expandedItems, setExpandedItems] = useState({
    Work: false,
    Media: false,
    Comms: false,
  });

  const categories = [
    {
      id: 1,
      name: "Uncategorized",
      time: "2h 14m 40s",
      type: "bullet",
    },
    {
      id: 2,
      name: "Work",
      time: "52m 2s",
      type: "expandable",
    },
    {
      id: 3,
      name: "Media",
      time: "21m 32s",
      type: "expandable",
      children: [
        { id: 4, name: "Video", time: "21m 26s", type: "bullet" },
        { id: 5, name: "Social Media", time: "5s", type: "bullet" },
      ],
    },
    {
      id: 6,
      name: "Comms",
      time: "1m 51s",
      type: "expandable",
    },
  ];

  const toggleExpand = (categoryName) => {
    setExpandedItems((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const renderIcon = (type, isExpanded) => {
    if (type === "bullet") {
      return <div className="w-3 h-3 bg-gray-400 rounded-full mt-1.5" />;
    }
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-4 h-4 border border-gray-400 flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-gray-50"
      >
        {isExpanded ? "−" : "+"}
      </button>
    );
  };

  const renderCategory = (category, level = 0) => {
    const isExpanded = expandedItems[category.name];

    return (
      <div key={category.id} className="select-none">
        <div
          className={`flex items-start gap-2 py-1 ${level > 0 ? "ml-6" : ""} ${
            category.type === "expandable"
              ? "cursor-pointer hover:bg-gray-50"
              : ""
          }`}
          onClick={() =>
            category.type === "expandable" && toggleExpand(category.name)
          }
        >
          {renderIcon(category.type, isExpanded)}
          <div className="flex-1 flex justify-between items-center">
            <span className="text-gray-700">{category.name}</span>
            <span className="text-gray-500 text-sm">{category.time}</span>
          </div>
        </div>
        {category.children && isExpanded && (
          <div className="animate-fadeIn">
            {category.children.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-72 p-4 bg-white">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Category Tree
      </h2>
      <div className="space-y-1">
        {categories.map((category) => renderCategory(category))}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Checkbox
          id="show-percent"
          checked={showPercent}
          onCheckedChange={setShowPercent}
          className="h-4 w-4"
        />
        <label htmlFor="show-percent" className="text-sm text-gray-600">
          Show percent
        </label>
      </div>
    </div>
  );
};

export default CategoryTree;
