import React from "react";
import { useNavigate } from "react-router";
import Navbar from "../navbar/Navbar";

function SelectPhase() {
  const navigate = useNavigate();
  return (
    <div className="w-full mt-12 flex-col space-y-6">
      <Navbar/>
      <h1 className="text-3xl font-bold text-blue-600 md:text-4xl">
        Create Quiz
      </h1>
      <div className="flex flex-col items-center justify-center space-y-4">
        <button
          className="w-full py-2 md:w-1/3 rounded-md bg-gradient-to-r from-blue-600 to-pink-700"
          // onClick={() => navigate("/quizDesc")}
          onClick={() => navigate("/quizDesc")}
        >
          Create Manually ✍️
        </button>
        {/* <p className="text-2xl font-semibold md:text-3xl">Or</p> */}
        <button
          className="w-full py-2 md:w-1/3 rounded-md bg-gradient-to-r from-pink-600 to-violet-600"
          onClick={() => navigate("/autoGen")}
        >
          Generate Using AI 🤖
        </button>
        <button className="w-full py-2 md:w-1/3 rounded-md bg-gradient-to-r from-blue-600 to-pink-700" onClick={()=>navigate("/remaining")}>
          Generate Using PDF 📄
        </button>
      </div>
    </div>
  );
}

export default SelectPhase;
