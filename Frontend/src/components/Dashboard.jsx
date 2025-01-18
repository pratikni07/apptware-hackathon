import React, { useState } from "react";
import Titles from "./Titles";
import AnimationSunburst from "./AnimationSunburst";
import { RefreshCcw } from "lucide-react";
import useSele
const Dashboard = () => {
  const tabs = ["Windows", "MacOS", "Linux"];
  const [activeTab, setActiveTab] = useState("Windows");

  return (
    <div className="flex justify-center items-center min-h-screen p-8 px-20">
      <div className="bg-[#1c1c1c] w-full border border-zinc-700 shadow-md rounded-lg">
        <div className="p-6 flex items-center justify-between">
          <div className="flex flex-col gap-4">
            <div className="text-white text-4xl">
              Hi <span className="text-green-500">pratiknikat07@gmail.com</span>
              !
            </div>
            <div className="text-white text-3xl ">
              Your activity for{" "}
              <span className="text-zinc-500">2025-01-18</span> is here!
            </div>
            <div className="flex">
              <div className="text-white bg-zinc-700 p-2 rounded-lg text-sm">
                <span className="font-medium">Time active: </span>6h 34m 20s
              </div>
            </div>
          </div>
          <button className="mt-2 flex items-center justify-center py-3 px-2 text-gray-400 hover:text-white transition-colors border border-gray-400 hover:border-white rounded-lg">
            <span className="mr-1">Refresh</span>
            <RefreshCcw size={16} />
          </button>
        </div>

        <div>
          {/* Tab Navigation */}
          <div className="border-b border-gray-700">
            <nav className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                py-4 px-6 text-sm font-medium leading-5 
                ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-400"
                    : "text-gray-400 hover:text-gray-300 hover:border-gray-700"
                }
                focus:outline-none focus:text-blue-400 focus:border-blue-400
                transition duration-150 ease-in-out
              `}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="border-t border-zinc-700 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="w-full max-w-md p-6 rounded-lg">
              <h2 className="text-xl text-white mb-4">Top Window Titles</h2>
              <Titles />
            </div>

            <div className="w-full max-w-md p-6 rounded-lg">
              <h2 className="text-xl text-white mb-4">Top Categories</h2>
              <Titles />
            </div>

            <div className="w-full max-w-md p-6 rounded-lg">
              <h2 className="text-xl text-white mb-4">Top Categories</h2>
              <AnimationSunburst />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
