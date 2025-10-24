import React from "react";
import Navbar from "../navbar/Navbar";

function Home() {
  console.log(`${import.meta.env.VITE_API_URL}`)
  return (
    <div className="w-full relative md:grid md:grid-cols-12 md:gap-6">
      
      {/* Sidebar / Bottom Navbar */}
      
    <Navbar/>
      {/* Main Content */}
      <div className="w-full min-h-screen md:col-span-11 flex flex-col items-center justify-center text-center space-y-5 md:space-y-10">
        <h1 className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
          Crafted by Teachers, Powered by AI, Perfected by Students.
        </h1>

        <h1 className="text-2xl lg:text-4xl font-bold  bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
          Generate and Practice Quizzes to Crack Your Dream Examination
        </h1>

        <h1 className="text-lg lg:text-2xl font-semibold  bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
          GATE, CUET, NIMCET - Every Type of MCQ-Based Exam Preparation Guide
        </h1>

        <button className="text-md px-4 py-3 md:px-8 md:text-lg font-bold rounded-full shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white hover:scale-105 transition duration-300">
          🚀 Powered By AI
        </button>
      </div>
    </div>
  );
}

export default Home;
