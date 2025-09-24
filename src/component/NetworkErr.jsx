import React from 'react'
import networkErr from "../assets/networkError.png"
import { useNavigate } from 'react-router'

function NetworkErr() {
    const navigate=useNavigate()
  return (
    <div className="flex items-center justify-center mt-6 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
          <div className="flex flex-col items-center text-center p-6 md:p-10 rounded-2xl shadow-lg bg-white dark:bg-gray-800 w-[90%] max-w-lg">
            {/* Heading */}
            <h1 className="text-5xl font-bold mb-2">500</h1>
            <p className="text-lg mb-4 flex items-center gap-2">
              Please Check Your Network <span className="text-red-500 text-xl">📶</span>
            </p>
    
            {/* Image */}
            <div className=" mb-6">
              <img
                src={networkErr}
                alt="404 Not Found"
                className="w-full object-contain"
              />
            </div>
    
            {/* Button */}
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white text-sm md:text-base font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Go to Homepage
            </button>
          </div>
        </div>
  )
}

export default NetworkErr