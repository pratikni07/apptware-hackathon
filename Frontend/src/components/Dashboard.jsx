import React, { useState, useEffect } from "react";
import Titles from "./Titles";
import AnimationSunburst from "./AnimationSunburst";
import { RefreshCcw } from "lucide-react";
import { fetchUserData, fetchWindow } from "./../slices/activitySlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const tabs = ["Windows", "MacOS", "Linux"];
  const [activeTab, setActiveTab] = useState("Windows");

  const { userId } = useParams();

  const loading = useSelector((state) => state.activity.loading);
  const error = useSelector((state) => state.activity.error);
  const user = useSelector((state) => state.activity.user);

  const activeHours = useSelector((state) => state.activity.activeHours);
  const minutes = useSelector((state) => state.activity.minutes);
  const dispatch = useDispatch();

  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();

  const hours = Math.floor(activeHours);
  const roundedMinutes = Math.floor(minutes);
  const seconds = Math.round((minutes - roundedMinutes) * 60);

  const formattedTime = `${hours} hr ${roundedMinutes} min ${seconds} sec`;

  const linuxWindows = useSelector((state) => state.activity.linuxWindows);
  const macWindows = useSelector((state) => state.activity.macWindows);
  const windowsWindows = useSelector((state) => state.activity.windowsWindows);

  useEffect(() => {
    const data = {
      userId: userId,
      date: date,
    };

    if (userId) {
      dispatch(fetchUserData(userId));
      dispatch(fetchWindow(data));
    }
  }, [dispatch]);

  // Function to get the appropriate window data based on active tab
  const getWindowData = () => {
    switch (activeTab) {
      case "Linux":
        return linuxWindows;
      case "MacOS":
        return macWindows;
      case "Windows":
        return windowsWindows;
      default:
        return windowsWindows;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const firstName =
    user?.firstName.charAt(0).toUpperCase() + user?.firstName.slice(1);
  const lastName =
    user?.lastName.charAt(0).toUpperCase() + user?.lastName.slice(1);

  return (
    <div className="bg-[#1c1c1c]/80 flex justify-center items-center min-h-screen p-6 px-20">
      <div className="bg-[#1c1c1c] w-full rounded-lg">
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="text-white text-4xl">
              Hey there,{" "}
              <span className="underline decoration-pink-500">
                {firstName} {lastName}
              </span>
              ! 👋
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="text-zinc-300 text-xl">
                Your activity for{" "}
                <span className="underline decoration-indigo-500">
                  {month} {day}, {year}
                </span>{" "}
                is:{" "}
                <span className="text-white underline decoration-indigo-500">
                  {formattedTime}
                </span>
              </div>

              <button className="mt-1">
                <RefreshCcw size={20} />
              </button>
            </div>
          </div>
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
                    py-4 px-6 text-lg font-medium leading-5 
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

          {/* Tab Content */}
          <div className="border-t border-zinc-700 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            <div className="w-full max-w-md p-6 rounded-lg">
              <h2 className="text-xl text-white mb-4">User behaviour</h2>
              <Titles windowData={getWindowData()} />
            </div>

            <div className="w-full max-w-md p-6 rounded-lg">
              <h2 className="text-xl text-white mb-4">
                Breakdown in categories
              </h2>
              <Titles windowData={getWindowData()} />
              {/* <AnimationSunburst /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
