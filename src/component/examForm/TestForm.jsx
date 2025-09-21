import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { performAnswer } from "../../Store/questionFormat";
import { jwtDecode } from "jwt-decode";
import authService from "../../authentication/auth";
import axios from "axios";

function TestForm() {
  const [submit, setSubmit] = useState(false);
  const [checked, setChecked] = useState([]);
  const [qindex, setQindex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msqAnswers, setMsqAnswers] = useState({});

  const location = useLocation();
  const userId = location.state?.userId || -1;
  const duration = location.state?.duration || 0;

  const questionList = useSelector(
    (state) => state.questionInformation
  ) || [];

  const totalQuestion = questionList.length;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize checked array and remaining time once questions load
  useEffect(() => {
    if (totalQuestion > 0) {
      setChecked(Array(totalQuestion).fill(false));
      setRemainingTime(duration * 60);
      setLoading(false);
    }
  }, [totalQuestion, duration]);

  // Enter fullscreen and prevent certain keys
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
        if (exp * 1000 < Date.now()) {
          authService.logout();
          navigate("/");
          return;
        }

        // Merge MSQ answers into questionList
        const finalAnswers = questionList.map((q, i) => ({
          ...q,
          answer: q.type === "MSQ" ? msqAnswers[i] || "" : q.answer || "",
        }));

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/answeredQuiz/${userId}`,
          finalAnswers,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          navigate("/xmsuccess");
        }
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setSubmit(false);
      }
    },
    [questionList, navigate, submit, msqAnswers, userId]
  );

  if (loading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl text-blue-600 dark:text-blue-400 font-semibold">
          Loading Questions...
        </div>
      </div>
    );

  if (submitting)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-xl text-red-600 dark:text-red-400 font-semibold">
          Submitting Answers...
        </div>
      </div>
    );

  return (
    <div className="w-full min-h-screen flex flex-col space-y-6 p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center text-lg font-semibold border-b pb-3">
        <span className="text-blue-600 dark:text-blue-400">
          Remaining Questions:{" "}
          <span className="font-bold">
            {totalQuestion - checked.filter((c) => c).length}
          </span>
        </span>
        <span className="text-red-600 dark:text-red-400">
          ⏳ Time Left: <span className="font-mono">{formatTime(remainingTime)}</span>
        </span>
      </div>

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
        {questionList.map((_, i) => (
          <div
            key={i}
            className={`w-10 h-10 flex items-center justify-center rounded-md border cursor-pointer shadow-sm transition 
            ${
              qindex === i
                ? "bg-blue-500 text-white"
                : checked[i]
                ? "bg-green-500 text-white"
                : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100"
            } hover:bg-blue-100 dark:hover:bg-blue-700`}
            onClick={() => setQindex(i)}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Current Question */}
      {questionList[qindex] && (
        <div className="flex flex-col space-y-6">
          <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md">
            <div className="font-medium text-lg mb-3">
              Q{qindex + 1}. {questionList[qindex].question}
            </div>

            {/* MCQ */}
            {questionList[qindex].type === "MCQ" && (
              <div className="space-y-2">
                {
                  questionList[qindex].options
                .map((option, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition"
                  >
                    <input
                      type="radio"
                      name={`q-${qindex}`}
                      value={option}
                      onChange={() => {
                        dispatch(performAnswer({ qindex, option }));
                        setChecked((prev) => {
                          const newChecked = [...prev];
                          newChecked[qindex] = true;
                          return newChecked;
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
                className="border w-full p-2 rounded-md bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                value={questionList[qindex].answer || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  dispatch(performAnswer({ qindex, value }));
                  setChecked((prev) => {
                    const newChecked = [...prev];
                    newChecked[qindex] = value.trim() !== "";
                    return newChecked;
                  });
                }}
              />
            )}

            {/* MSQ */}
            {questionList[qindex].type === "MSQ" && (
              <div className="space-y-2">
                {
                  questionList[qindex].options
                .map((option, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition"
                  >
                    <input
                      type="checkbox"
                      value={option}
                      checked={
                        msqAnswers[qindex]
                          ? msqAnswers[qindex].split(",").includes(option)
                          : false
                      }
                      onChange={(e) => {
                        const checkedOption = e.target.value;
                        setMsqAnswers((prev) => {
                          const prevAnswers = prev[qindex]
                            ? prev[qindex].split(",")
                            : [];
                          const newAnswers = e.target.checked
                            ? [...prevAnswers, checkedOption]
                            : prevAnswers.filter((ans) => ans !== checkedOption);
                          const joined = newAnswers.join(",");
                          dispatch(performAnswer({ qindex, option: joined }));
                          setChecked((prevChk) => {
                            const newChecked = [...prevChk];
                            newChecked[qindex] = newAnswers.length > 0;
                            return newChecked;
                          });
                          return { ...prev, [qindex]: joined };
                        });
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-4">
              {qindex > 0 && (
                <button
                  onClick={() => setQindex((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  Previous
                </button>
              )}
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
                  className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
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
