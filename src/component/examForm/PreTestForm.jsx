import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import authService from "../../authentication/auth";
import { loadData } from "../../Store/questionFormat";
import Navbar from "../navbar/Navbar";

function PreseTestForm() {
  const [userId, setUserId] = useState(-1);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fullMarks, setFullMarks] = useState(0);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const quizDetails = useSelector((state) => state.examinationInfo.xminfo);
  const location = useLocation();
  const quizId = location.state?.qid;

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
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
          `${import.meta.env.VITE_API_URL}/questionSet/${quizId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          dispatch(loadData(response.data));
          setUserId(response.data.id);
          setDuration(response.data.duration);
          setFullMarks(response.data.fullMarks);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [dispatch, navigate, quizId]);
  useEffect(() => {
    const fm =
      quizDetails.mcq1 +
      quizDetails.mcq2 * 2 +
      quizDetails.msq1 +
      quizDetails.msq2 * 2 +
      quizDetails.nat1 +
      quizDetails.nat2 * 2;
    setFullMarks(fm);
    setDuration(quizDetails.duration);
  }, [quizDetails]);

  const handleStartTest = () => {
    // navigate("/remaining")
    navigate("/test", { state: { userId: userId, duration: duration } });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 dark:border-gray-700 h-24 w-24 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Loading Quiz...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg transition-colors duration-300 space-y-6">
      <Navbar />
      {/* Exam Details */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-center">📋 Exam Details</h1>
        <div className="flex justify-between text-gray-700 dark:text-gray-300 font-medium">
          <span>
            Full Marks: <b>{fullMarks}</b>
          </span>
          <span>
            Duration: <b>{duration}</b>
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col space-y-2">
        <h2 className="text-xl font-semibold text-center">
          📝 Important Notes
        </h2>
        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
          <li>During test, you can only use the buttons on the screen.</li>
          <li>You can leave the quiz only after submitting.</li>
          <li>Your answers will be saved automatically.</li>
          <li>
            Use Desktop / Laptop for better experience. It will enhance your
            speed.
          </li>
        </ul>
      </div>

      {/* Message */}
      <p className="text-center text-gray-700 dark:text-gray-300 font-medium">
        Be honest in this test. Your discipline and honesty are pre-steps toward
        your success.{" "}
        <span className="font-bold text-pink-600 dark:text-pink-400">
          Best Of Luck!
        </span>
      </p>

      {/* Start Test Button */}
      <div className="flex justify-center">
        <button
          onClick={handleStartTest}
          className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        >
          Start Test
        </button>
      </div>

      {/* Loader CSS */}
      <style>{`
        .loader {
          border-top-color: #f472b6;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default PreseTestForm;
