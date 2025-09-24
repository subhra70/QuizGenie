import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { setData } from "../../Store/answerInfo";
import Navbar from "../navbar/Navbar";

function Answer() {
  const location = useLocation();
  const quizId = location.state?.qid;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const answers = useSelector((state) => state.answerInfo) || { questions: [] };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
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
          dispatch(setData(response.data));
        } else if (response.status === 401) {
          navigate("/unauthorized");
        } else if (response.status === 404) {
          navigate("/noData");
        } else {
          navigate("/netErr");
        }
      } catch (error) {
        console.error(error);
        navigate("/netErr");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if no questions in state
    if (!answers.questions || answers.questions.length === 0) {
      fetchDetails();
    } else {
      setIsLoading(false);
    }
  }, [quizId, dispatch, navigate, answers.questions]);

  return (
    <div className="w-full min-h-screen p-4 bg-gray-100 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-lg font-semibold animate-pulse">Loading...</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {answers.questions.map((ans, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
            >
              {/* Question */}
              <h2 className="text-lg md:text-xl font-semibold mb-3">
                Q{idx + 1}. {ans.question}
              </h2>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {ans.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg border ${
                      ans.answer === option
                        ? "border-green-600 bg-green-50 dark:bg-green-900/30"
                        : "border-gray-300 dark:border-gray-700"
                    }`}
                  >
                    <span className="font-medium">
                      ({String.fromCharCode(97 + index)}) {option}
                    </span>
                  </div>
                ))}
              </div>

              {/* Correct Answer */}
              <div className="mt-2">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ✅ Correct Answer: {ans.answer}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Answer;
