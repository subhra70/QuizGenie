import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import authService from "../../authentication/auth";
import axios from "axios";
import Navbar from "../navbar/Navbar";

function TestForm() {
  const [submit, setSubmit] = useState(false);
  const [qindex, setQindex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answer, setAnswer] = useState([]);

  const location = useLocation();
  const userId = location.state?.userId || -1;
  const duration = location.state?.duration || 0;

  const questionList = useSelector((state) => state.questionInformation) || [];
  const totalQuestion = questionList.length;

  const navigate = useNavigate();

  // Initialize answers and timer
  useEffect(() => {
    if (totalQuestion > 0) {
      setRemainingTime(duration * 60);
      setAnswer(
        questionList.map((q) => ({
          id: q.id,
          answer: [],
        }))
      );
      setLoading(false);
    }
  }, [totalQuestion, duration, questionList]);

  // Fullscreen + block refresh/escape
  useEffect(() => {
    const enterFullScreen = () => {
      const elem = document.documentElement;
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    };
    enterFullScreen();

    const handleBeforeUnload = (e) => {
      if (!submit) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleKeyDown = (e) => {
      if (!submit) {
        if (
          (e.key.startsWith("F") && e.key.length <= 3) ||
          e.key === "Escape" ||
          (e.ctrlKey && e.key === "r") ||
          (e.metaKey && e.key === "r")
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [submit]);

  // Timer
  useEffect(() => {
    if (remainingTime <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [remainingTime]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${String(m).padStart(2, "0")}:${String(
      s
    ).padStart(2, "0")}`;
  };

  // Submit answers
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (submit) return;
      setSubmitting(true);
      setSubmit(true);

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

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/answeredQuiz/${userId}`,
          answer,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          setSubmitting(false);
          setSubmit(false);
          navigate("/xmsuccess");
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setSubmit(false);
      }
    },
    [answer, navigate, submit, userId]
  );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 animate-pulse">
          Loading Questions...
        </p>
      </div>
    );

  if (submitting)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl font-semibold text-red-600 dark:text-red-400 animate-pulse">
          Submitting Answers...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center text-lg font-semibold border-b pb-3 gap-2">
        <span className="text-blue-600 dark:text-blue-400">
          Remaining Questions:{" "}
          <span className="font-bold">
            {totalQuestion - answer.filter((a) => a.answer.length > 0).length}
          </span>
        </span>
        <span className="text-red-600 dark:text-red-400">
          ⏳ Time Left:{" "}
          <span className="font-mono">{formatTime(remainingTime)}</span>
        </span>
      </div>

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {questionList.map((_, i) => (
          <button
            key={i}
            className={`w-10 h-10 flex items-center justify-center rounded-md border cursor-pointer shadow-sm transition
            ${
              qindex === i
                ? "bg-blue-500 text-white"
                : answer[i]?.answer.length > 0
                ? "bg-green-500 text-white"
                : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100"
            } hover:scale-105 duration-200`}
            onClick={() => setQindex(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current Question */}
      {questionList[qindex] && (
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between md:space-x-5 text-sm md:text-base font-medium">
            <span>Type: {questionList[qindex].type}</span>
            <span>Marks: {questionList[qindex].marks}</span>
            <span>Negative: {questionList[qindex].negMark}</span>
          </div>

          <div className="p-4 md:p-6 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
            <div className="font-medium text-lg mb-3">
              Q{qindex + 1}. {questionList[qindex].question}
            </div>

            {/* MCQ */}
            {questionList[qindex].type === "MCQ" && (
              <div className="space-y-2">
                {questionList[qindex].options.map((option, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition"
                  >
                    <input
                      type="radio"
                      name={`q-${qindex}`}
                      value={option}
                      checked={answer[qindex]?.answer[0] === option}
                      onChange={() => {
                        setAnswer((prev) => {
                          const newAns = [...prev];
                          newAns[qindex] = {
                            id: questionList[qindex].qid,
                            answer: [option],
                          };
                          return newAns;
                        });
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* NAT */}
            {questionList[qindex].type === "NAT" && (
              <input
                type="text"
                className="border w-full p-2 rounded-md bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors"
                value={answer[qindex]?.answer[0] || ""}
                onChange={(e) => {
                  setAnswer((prev) => {
                    const newAns = [...prev];
                    newAns[qindex] = {
                      id: questionList[qindex].qid,
                      answer: [e.target.value],
                    };
                    return newAns;
                  });
                }}
              />
            )}

            {/* MSQ */}
            {questionList[qindex].type === "MSQ" && (
              <div className="space-y-2">
                {questionList[qindex].options.map((option, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={answer[qindex]?.answer.includes(option)}
                      onChange={(e) => {
                        setAnswer((prev) => {
                          const newAns = [...prev];
                          const current = [...(newAns[qindex]?.answer || [])];
                          if (e.target.checked) {
                            if (!current.includes(option)) current.push(option);
                          } else {
                            const idx = current.indexOf(option);
                            if (idx > -1) current.splice(idx, 1);
                          }
                          newAns[qindex] = {
                            id: questionList[qindex].qid,
                            answer: current,
                          };
                          return newAns;
                        });
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
              {qindex > 0 && (
                <button
                  onClick={() => setQindex((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  Previous
                </button>
              )}

              <button
                onClick={() =>
                  setAnswer((prev) => {
                    const newRes = [...prev];
                    newRes[qindex] = {
                      id: questionList[qindex].qid,
                      answer: [],
                    };
                    return newRes;
                  })
                }
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
              >
                Reset
              </button>

              {qindex < totalQuestion - 1 && (
                <button
                  onClick={() => setQindex((prev) => prev + 1)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  Next
                </button>
              )}

              {qindex === totalQuestion - 1 && (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestForm;
