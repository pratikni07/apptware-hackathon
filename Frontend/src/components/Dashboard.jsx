import React, { useState, useEffect } from "react";
import Titles from "./Titles";
import { RefreshCcw } from "lucide-react";
import {
  fetchUserData,
  fetchWindow,
  fetchCategoryData,
} from "./../slices/activitySlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CategoryTitles from "./CategoryTitles";
import SystemUsage from "./SystemUsage";
import toast from "react-hot-toast";

const Dashboard = () => {
  const tabs = ["Windows", "MacOS", "Linux"];
  const [activeTab, setActiveTab] = useState("Windows");

  const windowsActive= useSelector((state) => state.activity.windowsActiveHours);
  const linuxActive = useSelector((state) => state.activity.linuxActiveHours);
  const macActive = useSelector((state) => state.activity.macActiveHours);

  useEffect(() => {
    if(activeTab=="MacOS"){
      // formattedTime= `${macActive.hours} hr ${macActive.minutes} min ${macActive.seconds} sec`
      setFormattedTime(`${macActive.hours} hr ${macActive.minutes} min ${macActive.seconds} sec`)
    }else if( activeTab=="Linux"){
      // formattedTime= `${linuxActive.hours} hr ${linuxActive.minutes} min ${linuxActive.seconds} sec`
      setFormattedTime(`${linuxActive.hours} hr ${linuxActive.minutes} min ${linuxActive.seconds} sec`)

    }else{
      // formattedTime= `${windowsActive.hours} hr ${windowsActive.minutes} min ${windowsActive.seconds} sec`
      setFormattedTime(`${windowsActive.hours/2} hr ${windowsActive.minutes} min ${windowsActive.seconds} sec`)
    }

     
  }, [activeTab,windowsActive,linuxActive,macActive]);
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

  const [formattedTime,setFormattedTime]=useState(`${windowsActive.hours/2} hr ${windowsActive.minutes} min ${windowsActive.seconds} sec`);


  const linuxWindows = useSelector((state) => state.activity.linuxWindows);
  const macWindows = useSelector((state) => state.activity.macWindows);
  const windowsWindows = useSelector((state) => state.activity.windowsWindows);

  const winCategory = useSelector((state) => state.activity.windowsCategory);
  const linuxCategory = useSelector((state) => state.activity.linuxCategory);
  const macCategory = useSelector((state) => state.activity.macCategory);

  const windowsMatrix = useSelector((state) => state.activity.windowsMatrix);
  const linuxMatrix = useSelector((state) => state.activity.linuxMatrix);
  const macMatrix = useSelector((state) => state.activity.macMatrix);

console.log('mac cat',macCategory)

  useEffect(() => {
    const interval = setInterval(() => {
      handleClick(new Event("click"));
    }, 20000);

    return () => clearInterval(interval); 
  }, []);


  // console.log("we we windows", windowsWindows);

  useEffect(() => {
    const data = {
      userId: userId,
      date: date,
    };

    if (userId) {
      dispatch(fetchUserData(userId));
      dispatch(fetchWindow(data));
      dispatch(fetchCategoryData(userId));
    }
  }, [dispatch]);

  const handleClick = (e) => {
    e.preventDefault();
    const data = {
      userId: userId,
      date: date,
    };
    dispatch(fetchUserData(userId));
    dispatch(fetchWindow(data));
    dispatch(fetchCategoryData(userId));
  };

  const getMetricData = () => {
    switch (activeTab) {
      case "Linux":
        return linuxMatrix;
      case "MacOS":
        return macMatrix;
      case "Windows":
        return windowsMatrix;
      default:
        return windowsMatrix;
    }
  };

  const getCategoryData = () => {
    switch (activeTab) {
      case "Linux":
        return linuxCategory;
      case "MacOS":
        return macCategory;
      case "Windows":
        return winCategory;
      default:
        return winCategory;
    }
  };

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
    toast("Loading..");
  }

  if (error) {
    return (
      <div className="text-red-500 flex items-center justify-center min-h-screen">
        Error: {error}
      </div>
    );
  }

  const firstName =
    user?.firstName.charAt(0).toUpperCase() + user?.firstName.slice(1);
  const lastName =
    user?.lastName.charAt(0).toUpperCase() + user?.lastName.slice(1);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isOwnProfile =
    storedUser.firstname === firstName && storedUser.lastname === lastName;

  return (
    <div className="bg-[#1c1c1c]/80 flex justify-center items-center min-h-screen p-6 px-20">
      <div className="bg-[#1c1c1c] w-full rounded-lg">
        <div className="p-6 flex items-center justify-between">
          <div>
            <div className="text-white text-4xl">
              {isOwnProfile ? <>Hey there, </> : <>This is </>}
              <span className="underline decoration-pink-500">
                {firstName} {lastName}
              </span>
              ,
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className="text-zinc-300 text-xl">
                {isOwnProfile ? "Your" : "Their"} activity for{" "}
                <span className="underline decoration-indigo-500">
                  {month} {day}, {year}
                </span>{" "}
                is:{" "}
                <span className="text-white underline decoration-indigo-500">
                  {formattedTime}
                </span>
              </div>

              <button className="mt-1" onClick={handleClick}>
                <RefreshCcw size={20} />
              </button>
            </div>
          </div>
          <SystemUsage metricData={getMetricData()} activeOS={activeTab} />
        </div>

        <div>
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

          <div className="border-t border-zinc-700 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            <div className="w-full max-w-md p-6 rounded-lg">
              <h2 className="text-xl text-white mb-4">User behaviour</h2>
              <Titles windowData={getWindowData()} />
            </div>

            <div className="w-full max-w-md p-6 rounded-lg">
              <h2 className="text-xl text-white mb-4">
                Breakdown in categories
              </h2>
              <CategoryTitles windowData={getCategoryData()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
