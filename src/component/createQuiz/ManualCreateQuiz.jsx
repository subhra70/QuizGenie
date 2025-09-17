import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Navbar from "../navbar/Navbar";

function ManualCreateQuiz() {
  const navigate = useNavigate();
  const options = ["a", "b", "c", "d"];
  const xmInfo = useSelector((state) => state.examinationInfo.xminfo);
  const [error, setError] = useState(false);
  const [selectAll, setSelectedAll] = useState(false);

  const [checkItem, setCheckItem] = useState([]);
  const [mcq1, setMcq1] = useState(xmInfo.mcq1);
  const [msq1, setMsq1] = useState(xmInfo.msq1);
  const [nat1, setNat1] = useState(xmInfo.nat1);
  const [mcq2, setMcq2] = useState(xmInfo.mcq2);
  const [msq2, setMsq2] = useState(xmInfo.msq2);
  const [nat2, setNat2] = useState(xmInfo.nat2);
  const totalQuestion=xmInfo?.totalQuestion||0;
  useEffect(() => {
    if (!xmInfo || xmInfo.totalQuestion === 0) {
      navigate("/quizDesc");
    }
  }, [xmInfo, navigate]);

  // questions state
  const [questions, setQuestions] = useState(
    xmInfo
      ? Array.from({ length: xmInfo.totalQuestion }, () => ({
          questionName: "",
          options: ["", "", "", ""],
          type: "",
          mark: 0,
          answer: "",
        }))
      : []
  );

  const [selectType, setSelectType] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleQuestionSelection = (e) => {
    setSelectType(e.target.value);
    setError(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setQuestions((prev) => {
      const updated = [...prev];
      if (name.startsWith("option")) {
        const [, , optIndex] = name.split("-");
        updated[currentIndex].options[optIndex - 1] = value;
      } else {
        updated[currentIndex][name] = value;
      }
      return updated;
    });
  };

  const handleNext = () => {
    if (questions[currentIndex].options.includes("")) {
      setSelectedAll(false);
      return;
    } else {
      setSelectedAll(true);
    }
    if (!checkItem.includes(currentIndex)) {
      if (!selectType) {
        setError(true);
        return;
      }
      setQuestions((prev) => {
        const updated = [...prev];
        if (selectType === "mcq1") {
          updated[currentIndex].type = selectType;
          updated[currentIndex].mark = 1;
        } else if (selectType === "mcq2") {
          updated[currentIndex].type = selectType;
          updated[currentIndex].mark = 2;
        } else if (selectType === "msq1") {
          updated[currentIndex].type = selectType;
          updated[currentIndex].mark = 1;
        } else if (selectType === "msq2") {
          updated[currentIndex].type = selectType;
          updated[currentIndex].mark = 2;
        } else if (selectType === "nat1") {
          updated[currentIndex].type = selectType;
          updated[currentIndex].mark = 1;
        } else if (selectType === "nat2") {
          updated[currentIndex].type = selectType;
          updated[currentIndex].mark = 2;
        }
        return updated;
      });

      if (selectType === "mcq1") setMcq1((p) => p - 1);
      if (selectType === "mcq2") setMcq2((p) => p - 1);
      if (selectType === "msq1") setMsq1((p) => p - 1);
      if (selectType === "msq2") setMsq2((p) => p - 1);
      if (selectType === "nat1") setNat1((p) => p - 1);
      if (selectType === "nat2") setNat2((p) => p - 1);
      setCheckItem((prev) => [...prev, currentIndex]);
    }
    if (currentIndex < totalQuestion - 1) {
      setCurrentIndex((prev) => {
        const newIndex = Math.min(prev + 1, totalQuestion - 1);
        setSelectType(questions[newIndex]?.type || "");
        setSelectedAll(false);
        return newIndex;
      });
    }
  };
  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      const newIndex = Math.max(prev - 1, 0);
      setSelectType(questions[newIndex]?.type || "");
      return newIndex;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Final Questions:", questions);
    // API call or Redux dispatch can go here
  };

  if (!xmInfo || questions.length === 0) {
  return <div>Loading...</div>;
}
  const currentQ = questions[currentIndex];

  return (
    <div className="p-4 mt-5 md:p-8">
      <Navbar/>
      {/* Remaining Questions Info */}
      <div className="flex flex-wrap justify-between gap-3 text-sm md:text-base bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 p-4 rounded-lg shadow-sm dark:shadow-[0_4px_12px_rgba(255,255,255,0.15)]">
        <span className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
          Remaining Question:{" "}
          <span className="text-blue-600">{totalQuestion - currentIndex}</span>
        </span>
        {mcq1 > 0 && (
          <span className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            MCQ(1 Mark): <span className="text-blue-600">{mcq1}</span>
          </span>
        )}
        {mcq2 > 0 && (
          <span className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            MCQ(2 Mark): <span className="text-blue-600">{mcq2}</span>
          </span>
        )}
        {msq1 > 0 && (
          <span className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            MSQ(1 Mark): <span className="text-blue-600">{msq1}</span>
          </span>
        )}
        {msq2 > 0 && (
          <span className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            MSQ(2 Marks): <span className="text-blue-600">{msq2}</span>
          </span>
        )}
        {nat1 > 0 && (
          <span className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            NAT(1 Mark): <span className="text-blue-600">{nat1}</span>
          </span>
        )}
        {nat2 > 0 && (
          <span className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            NAT(2 Marks): <span className="text-blue-600">{nat2}</span>
          </span>
        )}
      </div>

      {/* Question Type Selection */}
      <div className="mt-8">
        <h1 className="text-lg font-bold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 mb-4">
          Select Question Type
        </h1>
        <div className="flex flex-wrap gap-4">
          {mcq1 > 0 && (
            <label className="flex items-center gap-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 px-3 py-2 rounded-lg cursor-pointer">
              <input
                type="radio"
                value="mcq1"
                className="accent-blue-600"
                onChange={handleQuestionSelection}
                checked={selectType === "mcq1"}
              />
              <span className="font-medium">MCQ (1 Mark)</span>
            </label>
          )}
          {mcq2 > 0 && (
            <label className="flex items-center gap-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 px-3 py-2 rounded-lg cursor-pointer">
              <input
                type="radio"
                value="mcq2"
                className="accent-blue-600"
                onChange={handleQuestionSelection}
                checked={selectType === "mcq2"}
              />
              <span className="font-medium">MCQ (2 Mark)</span>
            </label>
          )}
          {msq1 > 0 && (
            <label className="flex items-center gap-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 px-3 py-2 rounded-lg cursor-pointer">
              <input
                type="radio"
                value="msq1"
                className="accent-blue-600"
                onChange={handleQuestionSelection}
                checked={selectType === "msq1"}
              />
              <span className="font-medium">MSQ (1 Mark)</span>
            </label>
          )}
          {msq2 > 0 && (
            <label className="flex items-center gap-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 px-3 py-2 rounded-lg cursor-pointer">
              <input
                type="radio"
                value="msq2"
                className="accent-blue-600"
                onChange={handleQuestionSelection}
                checked={selectType === "msq2"}
              />
              <span className="font-medium">MSQ (2 Mark)</span>
            </label>
          )}
          {nat1 > 0 && (
            <label className="flex items-center gap-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 px-3 py-2 rounded-lg cursor-pointer ">
              <input
                type="radio"
                value="nat1"
                className="accent-blue-600"
                onChange={handleQuestionSelection}
                checked={selectType === "nat1"}
              />
              <span className="font-medium">NAT (1 Mark)</span>
            </label>
          )}
          {nat2 > 0 && (
            <label className="flex items-center gap-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 px-3 py-2 rounded-lg cursor-pointer">
              <input
                type="radio"
                value="nat2"
                className="accent-blue-600"
                onChange={handleQuestionSelection}
                checked={selectType === "nat2"}
              />
              <span className="font-medium">NAT (2 Mark)</span>
            </label>
          )}
        </div>
        {error && (
          <span className="text-sm text-red-500">Choose an option</span>
        )}
      </div>

      {/* Form Section */}
      <div className="w-full mt-12 rounded-xl shadow-lg dark:shadow-[0_4px_12px_rgba(255,255,255,0.15)] py-6 px-4 md:px-8 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 max-w-3xl mx-auto">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Question */}
          <div className="flex flex-col">
            <div>
              <label
                htmlFor={`question-${currentIndex}`}
                className="font-semibold text-lg mb-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
              >
                Question {currentIndex + 1}
              </label>
              {!selectAll && currentQ.questionName === "" && (
                <span className="text-sm text-red-500">*</span>
              )}
            </div>
            <input
              id={`question-${currentIndex}`}
              name="questionName"
              value={currentQ.questionName}
              onChange={handleInputChange}
              required
              type="text"
              placeholder="Type your question..."
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
            />
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-lg mb-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
              Options
            </label>
            {options.map((opt, index) => (
              <div
                key={opt}
                className="flex items-center justify-start gap-2 p-2 rounded-lg shadow-sm"
              >
                <span className="hidden md:block font-bold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
                  ({opt})
                </span>
                <input
                  type="text"
                  required
                  onChange={handleInputChange}
                  placeholder={`Option ${index + 1}`}
                  name={`option-${currentIndex}-${index + 1}`}
                  value={currentQ.options[index]}
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
                {!selectAll && currentQ.options[index] === "" && (
                  <span className="text-sm text-red-500">*</span>
                )}
              </div>
            ))}
          </div>

          {/* Answer */}
          <div className="flex flex-col">
            <label
              htmlFor={`answer-${currentIndex}`}
              className="font-semibold text-lg mb-2 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
            >
              Correct Answer
            </label>
            <input
              id={`answer-${currentIndex}`}
              name="answer"
              value={currentQ.answer}
              required
              type="text"
              onChange={handleInputChange}
              placeholder="Choose option (a, b, c, d)"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row gap-2">
            {currentIndex >= 1 && (
              <button
                type="button"
                className="w-full md:w-1/6 px-2 bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition duration-300"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            {currentIndex < totalQuestion - 1 ? (
              <button
                type="button"
                className="w-full md:w-1/6 px-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="w-full md:w-1/6 px-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
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
