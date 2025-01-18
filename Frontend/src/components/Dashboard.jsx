import React from "react";
import Titles from "./Titles";

const Dashboard = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-[#1c1c1c] w-full">
        <div className="p-6">
          <div className="text-white text-3xl">
            Activity for <span className="text-zinc-500">2025-01-18</span>
          </div>
          <div className="flex bg-zinc-700">
            <p>
              <span className="font-medium">Host: </span>Rohan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="w-full max-w-md p-6 rounded-lg">
            <h2 className="text-xl text-white mb-4">Top Window Titles</h2>
            <Titles />
          </div>

          <div className="w-full max-w-md p-6 rounded-lg">
            <h2 className="text-xl text-white mb-4">Top Categories</h2>
            <Titles />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
