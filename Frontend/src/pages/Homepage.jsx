import CategoryTree from "@/components/CategoryTree";
import WindowTitles from "@/components/WindowTitles";
import React from "react";

const Homepage = () => {
  return (
    <div className="bg-[#F7FAFC] min-h-screen flex flex-col items-center justify-center">
      <div className="p-20">
        <WindowTitles />
        <CategoryTree />
      </div>
    </div>
  );
};

export default Homepage;
