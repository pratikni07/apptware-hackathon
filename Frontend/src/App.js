import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Components from "./components/Components";
import GitHubRepo from "./components/code";
import "./App.css";
import "animate.css";

import AboutUs from "./components/Aboutus";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/Auth";

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/components" element={<Components />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/code" element={<GitHubRepo />} />
        <Route path="/code/:componentName" element={<GitHubRepo />} />
      </Routes>
    </div>
  );
}

export default App;
