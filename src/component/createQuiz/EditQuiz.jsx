import React, { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { MdTry } from "react-icons/md";

function EditQuiz() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const quizId = location.state?.qId;
  const [data, setData] = useState({
    quizId: -1,
    fullMarks: 0,
    duration: 0,
    questionSet: [
      {
        questionsId: -1,
        question: "",
        options: [],
        marks: 0,
        negMark: 0,
        type: "",
        answer: "",
      },
    ],
  });

  useEffect(() => {
    const loadDetails = async () => {
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
          const val = response.data;
          const updated = { ...data };
          updated.quizId = val.id;
          updated.fullMarks = val.fullMarks;
          updated.duration = val.duration;

          updated.questionSet = val.quizQuestion.map((q) => ({
            questionsId: q.id,
            question: q.question,
            options:
              q.marks.type !== "NAT"
                ? [q.option1, q.option2, q.option3, q.option4]
                : [],
            marks: q.marks.mark,
            negMark: q.marks.negMark,
            type: q.marks.type,
            answer: q.answer,
          }));

          setData(updated);

          setData(updated);
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    loadDetails();
  }, [quizId, setData]);
  const handleChange = (qIndex, field, value) => {
    const updated = { ...data };
    updated.questionSet[qIndex][field] = value;
    setData(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = { ...data };
    updated.questionSet[qIndex].options[oIndex] = value;
    setData(updated);
  };

  const handleDelete = (qidx) => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    const updated = { ...data };
    updated.fullMarks -= updated.questionSet[qidx].marks;
    updated.questionSet = updated.questionSet.filter((_, idx) => idx !== qidx);
    setData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/quiz`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        alert("Saved Changes");
        navigate("/resultHistory");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-6 flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FaQuestionCircle className="text-blue-500" /> Edit Quiz #
          {data.quizId + 1000}
        </h2>
        <div className="text-sm sm:text-base flex flex-col justify-center items-center sm:flex-row gap-2 sm:gap-6 mt-2 sm:mt-0">
          <span className="font-semibold">
            Full Marks: <span className="text-blue-500">{data.fullMarks}</span>
          </span>

          {/* ✅ Styled Duration Input */}
          <span className="font-semibold flex items-center gap-2">
            Duration:
            <input
              type="number"
              value={data.duration}
              onChange={(e) =>
                setData({ ...data, duration: Number(e.target.value) })
              }
              onWheel={(e) => e.target.blur()} // prevents scroll change
              className="no-spin w-20 sm:w-24 p-1 text-center rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-gray-600 dark:text-gray-300 text-sm">
              mins
            </span>
          </span>
        </div>
      </div>

      {/* Question Section */}
      <div className="flex flex-col gap-6">
        {data.questionSet.map((item, qIndex) => (
          <div
            key={qIndex}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            {/* Question Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm sm:text-base">
                <span>
                  <strong>Type:</strong> {item.type}
                </span>
                <span>
                  <strong>Marks:</strong> {item.marks}
                </span>
                <span>
                  <strong>Negative:</strong> {item.negMark}
                </span>
              </div>

              {/* ✅ Styled Delete Button */}
              <button
                onClick={() => handleDelete(qIndex)}
                className="p-2 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition shadow-sm"
                title="Delete Question"
              >
                <RiDeleteBinFill className="text-red-600 dark:text-red-400 text-lg" />
              </button>
            </div>

            {/* Question Input */}
            <label className="text-sm font-semibold">Question:</label>
            <input
              type="text"
              className="w-full mt-1 mb-3 p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={item.question}
              onChange={(e) => handleChange(qIndex, "question", e.target.value)}
            />

            {/* Options */}
            {item.type !== "NAT" && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Options:</label>
                {item.options.map((option, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                  />
                ))}
              </div>
            )}

            {/* Answer */}
            <div className="mt-3">
              <label className="text-sm font-semibold">Answer:</label>
              <input
                type="text"
                className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={item.answer}
                onChange={(e) => handleChange(qIndex, "answer", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-center">
        <button
          className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditQuiz;
