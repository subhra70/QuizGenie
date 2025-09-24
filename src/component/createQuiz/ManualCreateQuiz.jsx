import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Navbar from "../navbar/Navbar";
import { jwtDecode } from "jwt-decode";
import authService from "../../authentication/auth";

function ManualCreateQuiz() {
  const navigate = useNavigate();
  const options = ["a", "b", "c", "d"];
  const xmInfo = useSelector((state) => state.examinationInfo.xminfo);
  const [error, setError] = useState(false);
  const [selectAll, setSelectedAll] = useState(false);

  const [checkItem, setCheckItem] = useState([]);
  const totalQuestion = xmInfo?.totalQuestion || 0;
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // initialize question list
  useEffect(() => {
    if (totalQuestion > 0) {
      setQuestions(
        Array.from({ length: totalQuestion }, () => ({
          question: "",
          options: ["", "", "", ""], // fixed: initialize 4 options
          answer: "",
          type: "",
          mark: 0,
        }))
      );
    }
  }, [totalQuestion]);

  useEffect(() => {
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
    } catch (error) {
      console.log(error);
      authService.logout();
      navigate("/");
    }
  }, [navigate]);

  const currentQ = questions[currentIndex] || {};

  const handleQuestionSelection = (e) => {
    const value = e.target.value;
    setError(false);

    setQuestions((prev) => {
      const updated = [...prev];
      if (value === "mcq1") {
        updated[currentIndex].type = "MCQ";
        updated[currentIndex].mark = 1;
      } else if (value === "mcq2") {
        updated[currentIndex].type = "MCQ";
        updated[currentIndex].mark = 2;
      } else if (value === "msq1") {
        updated[currentIndex].type = "MSQ";
        updated[currentIndex].mark = 1;
      } else if (value === "msq2") {
        updated[currentIndex].type = "MSQ";
        updated[currentIndex].mark = 2;
      } else if (value === "nat1") {
        updated[currentIndex].type = "NAT";
        updated[currentIndex].mark = 1;
        updated[currentIndex].options = [];
      } else if (value === "nat2") {
        updated[currentIndex].type = "NAT";
        updated[currentIndex].mark = 2;
        updated[currentIndex].options = [];
      }
      return updated;
    });
  };

  const handleNext = () => {
    if (
      currentQ.type !== "NAT" &&
      currentQ.options.some((opt) => !opt.trim()) // fixed: check all options filled
    ) {
      setSelectedAll(false);
      return;
    } else {
      setSelectedAll(true);
    }

    if (!checkItem.includes(currentIndex)) {
      if (!currentQ.type) {
        setError(true);
        return;
      }
      setCheckItem((prev) => [...prev, currentIndex]);
    }

    if (currentIndex < totalQuestion - 1) {
      setCurrentIndex((prev) => Math.min(prev + 1, totalQuestion - 1));
      setSelectedAll(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Questions:", questions);
    navigate("/confirmPost", { state: { questionSet: questions } });
  };

  if (!xmInfo || totalQuestion === 0 || questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-2 mt-5 md:p-8">
      <Navbar />

      {/* Progress Info */}
      <div className="flex flex-wrap justify-between gap-3 text-sm md:text-base bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 p-4 rounded-lg shadow-sm">
        <span className="font-semibold">
          Question {currentIndex + 1} of {totalQuestion}
        </span>
        <span className="text-blue-600">
          Remaining: {totalQuestion - (currentIndex + 1)}
        </span>
      </div>

      {/* Question Type */}
      <div className="mt-8">
        <h1 className="text-lg font-bold mb-4">Select Question Type</h1>
        <div className="flex flex-wrap gap-4">
          {[
            { val: "mcq1", label: "MCQ (1 Mark)" },
            { val: "mcq2", label: "MCQ (2 Mark)" },
            { val: "msq1", label: "MSQ (1 Mark)" },
            { val: "msq2", label: "MSQ (2 Mark)" },
            { val: "nat1", label: "NAT (1 Mark)" },
            { val: "nat2", label: "NAT (2 Mark)" },
          ].map(({ val, label }) => (
            <label
              key={val}
              className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer bg-gray-100 dark:bg-gray-900"
            >
              <input
                type="radio"
                value={val}
                className="accent-blue-600"
                onChange={handleQuestionSelection}
                checked={
                  (val.startsWith("mcq") &&
                    currentQ.type === "MCQ" &&
                    currentQ.mark === parseInt(val.slice(-1))) ||
                  (val.startsWith("msq") &&
                    currentQ.type === "MSQ" &&
                    currentQ.mark === parseInt(val.slice(-1))) ||
                  (val.startsWith("nat") &&
                    currentQ.type === "NAT" &&
                    currentQ.mark === parseInt(val.slice(-1)))
                }
              />
              <span className="font-medium">{label}</span>
            </label>
          ))}
        </div>
        {error && <span className="text-sm text-red-500">Choose a type</span>}
      </div>

      {/* Form Section */}
      <div className="w-full mt-6 mb-8 rounded-xl shadow-lg py-6 pb-8 px-4 md:px-8 md:mt-12 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 max-w-3xl mx-auto">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Question */}
          <div>
            <label className="font-semibold text-lg">
              Question {currentIndex + 1}
            </label>
            {!selectAll && !currentQ.question && (
              <span className="text-sm text-red-500"> *required</span>
            )}
            <input
              type="text"
              placeholder="Type your question..."
              value={currentQ.question}
              onChange={(e) => {
                const newQ = [...questions];
                newQ[currentIndex] = {
                  ...newQ[currentIndex],
                  question: e.target.value,
                };
                setQuestions(newQ);
              }}
              className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              required
            />
          </div>

          {/* Options */}
          {currentQ.type !== "NAT" && (
            <div>
              <label className="font-semibold text-lg">Options</label>
              <div className="flex flex-col gap-3 mt-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="font-bold">({opt})</span>
                    <input
                      type="text"
                      placeholder={`Option ${idx + 1}`}
                      value={currentQ.options[idx]}
                      onChange={(e) => {
                        const newQ = [...questions];
                        const qCopy = { ...newQ[currentIndex] };
                        qCopy.options = [...qCopy.options];
                        qCopy.options[idx] = e.target.value;
                        newQ[currentIndex] = qCopy;
                        setQuestions(newQ);
                      }}
                      className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                         bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer */}
          <div>
            <label className="font-semibold text-lg">Correct Answer</label>
            <input
              type="text"
              placeholder="Answer1, Answer2, .."
              value={currentQ.answer}
              onChange={(e) => {
                const newQ = [...questions];
                newQ[currentIndex] = {
                  ...newQ[currentIndex],
                  answer: e.target.value,
                };
                setQuestions(newQ);
              }}
              className="w-full border rounded-lg px-4 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-green-500
                         bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              required
            />
          </div>

          {/* Navigation */}
          <div className="flex gap-2">
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="w-1/3 md:w-1/6 bg-yellow-500 text-white py-3 rounded-lg"
              >
                Previous
              </button>
            )}
            {currentIndex < totalQuestion - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-1/3 md:w-1/6 bg-blue-600 text-white py-3 rounded-lg"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="w-1/3 md:w-1/6 bg-green-600 text-white py-3 rounded-lg"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManualCreateQuiz;
