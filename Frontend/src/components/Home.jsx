import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { HeroScrollDemo } from "../components/elements/Containerscrollanimation";
import { LampDemo } from "../components/elements/Lamp";

const Home = () => {
  return (
    <div className="bg-[#1c1c1c] w-full">
      <Navbar />
      <Header />
      <div className="flex flex-col items-center overflow-hidden m-0 p-0">
        <HeroScrollDemo />
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="max-w-lg">
          <div className="text-center text-5xl font-medium tracking-tight text-transparent md:text-5xl  max-w-2xl mb-0">
            <span className="text-white leading-normal">Powerful Features</span>
          </div>
          <div className="flex justify-center items-center flex-col">
            <p className="text-slate-300 mt-8 text-2xl text-center">
              Everything you need to track and analyze user activity
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden z-0 mt-32">
        <LampDemo />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
