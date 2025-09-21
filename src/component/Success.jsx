import React from 'react';
import successImg from '../assets/successImg.png'; // Make sure to provide the correct image path

function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center transform transition duration-500 hover:scale-105">
        
        {/* Success Image */}
        <div className="w-32 h-32 mb-6">
          <img
            src={successImg}
            alt="Success"
            className="w-full h-full object-contain animate-bounce"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
          🎉 Successfully Generated!
        </h2>

        {/* Subtext */}
        <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm md:text-base">
          Your quiz has been generated successfully. Go to the History to give the test.
        </p>

        {/* Action Button */}
        <button
          onClick={() => window.location.href = '/resultHistory'}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-colors duration-300"
        >
          Go To History
        </button>
      </div>
    </div>
  );
}

export default Success;
