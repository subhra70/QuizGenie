import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadData, setTotalQuestions } from "../../Store/examInfo1";
import { useNavigate } from "react-router";
import Navbar from "../navbar/Navbar";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";
import { loadUserData } from "../../Store/userInfo";
import axios from "axios";

function QuizDescCard() {
  const [negvalue, setNegvalue] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState();
  const [totalQuestion, setTotalQuestion] = useState(0);
  const xmInfo = useSelector((state) => state.examinationInfo.xminfo);

  const [data, setData] = useState({
    format: "Manual",
    mcq1: 0,
    mcq2: 0,
    msq1: 0,
    msq2: 0,
    nat1: 0,
    nat2: 0,
    negativeMark: xmInfo.negativeMark || true,
    duration: xmInfo.totalQuestion !== 0 ? xmInfo.duration : 0,
    desc: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const { exp } = jwtDecode(token);
        if (!exp || exp * 1000 < Date.now()) {
          authService.logout();
          navigate("/");
          return;
        }
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/userDetails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          dispatch(loadUserData(response.data));
          setUserInfo(response.data);
        } else if (response.status === 404) {
          navigate("/noData");
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        authService.logout();
        navigate("/");
      }
    };
    fetchData();
  }, [navigate, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const intVal = ["duration"];
    setData({
      ...data,
      [name]: intVal.includes(name)
        ? value === ""
          ? 0
          : Number(value)
        : value,
    });
  };

  const handleNegative = (e) => {
    if (e.target.value === "yes") {
      setNegvalue(true);
      setData({ ...data, neg: true });
    } else {
      setNegvalue(false);
      setData({ ...data, neg: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.createTrial === 0) {
      navigate("/payment");
    }
    setIsSubmit(true);
    dispatch(loadData(data));
    dispatch(setTotalQuestions(totalQuestion));
    navigate("/createQuiz");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold animate-pulse text-blue-500">
          Loading...
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen items-center mt-8 px-4 py-8">
      <Navbar />
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl text-blue-600 font-extrabold mb-6 tracking-wide">
        Quiz Description
      </h1>

      {/* Free Trial Info */}
      {userInfo?.createTrial >= 0 && !userInfo?.premium && (
        <div className="mb-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-semibold rounded-lg shadow-md">
          Free Trial Remaining:{" "}
          <span className="text-blue-700 dark:text-blue-300 font-bold">
            {userInfo?.createTrial}
          </span>
        </div>
      )}
      {userInfo?.createTrial >= 0 &&
        userInfo?.premium &&
        userInfo?.monthDuration < 12 && (
          <div className="mb-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-semibold rounded-lg shadow-md">
            Trial Remaining:{" "}
            <span className="text-blue-700 dark:text-blue-300 font-bold">
              {userInfo?.createTrial}
            </span>
          </div>
        )}
      {/* Form Container */}
      <form
        className="w-full max-w-2xl rounded-2xl shadow-xl dark:shadow-[0_4px_12px_rgba(255,255,255,0.15)]  p-6 md:p-8 space-y-6
                   bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
        onSubmit={handleSubmit}
      >
        {/* Number of Questions & Negative Marking */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <label htmlFor="qno" className="font-semibold">
              No. of Questions
            </label>
            <input
              type="number"
              name="totalQuestion"
              required
              value={data.totalQuestion !== 0 ? data.totalQuestion : ""}
              placeholder="Enter number"
              onChange={(e) => setTotalQuestion(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
            />
          </div>

          <div className="flex flex-col space-y-2 items-center">
            <span className="font-semibold">Negative Marking</span>
            <div className="flex gap-x-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="negAllow"
                  className="accent-blue-600"
                  checked={negvalue === true}
                  value="yes"
                  onChange={handleNegative}
                />
                Yes
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="negAllow"
                  className="accent-blue-600"
                  checked={negvalue === false}
                  value="no"
                  onChange={handleNegative}
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Question Details
        <h2 className="text-2xl font-bold border-b pb-2">Question Details</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "mcq1", label: "MCQ (1 Mark)" },
            { name: "mcq2", label: "MCQ (2 Marks)" },
            { name: "msq1", label: "MSQ (1 Mark)" },
            { name: "msq2", label: "MSQ (2 Marks)" },
            { name: "nat1", label: "NAT (1 Mark)" },
            { name: "nat2", label: "NAT (2 Marks)" },
          ].map((field) => (
            <div key={field.name} className="flex flex-col space-y-2">
              <label htmlFor={field.name} className="font-medium">
                {field.label}
              </label>
              <input
                type="number"
                name={field.name}
                value={data[field.name] !== 0 ? data[field.name] : ""}
                onChange={handleInputChange}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                           bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              />
              {isError && (
                <span className="text-sm text-red-500">
                  Please select question type
                </span>
              )}
            </div>
          ))}
        </div> */}

        {/* Duration */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="duration" className="font-semibold">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            required
            value={data.duration !== 0 ? data.duration : ""}
            onChange={handleInputChange}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                       bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmit}
          className="w-full font-semibold py-2 px-4 rounded-lg shadow-md transition
                     bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </form>
    </div>
  );
}

export default QuizDescCard;
