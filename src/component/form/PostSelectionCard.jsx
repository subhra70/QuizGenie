import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Navbar from "../navbar/Navbar";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";
import { setFullMarks,setTotalQuestions} from "../../Store/examInfo1";
import axios from "axios";

function PostSelectionCard() {
  const xmInfo = useSelector((state) => state.examinationInfo.xminfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [totalQuestion, setTotalQuestion] = useState(xmInfo.totalQuestion);
  const [fullMark, setFullMark] = useState(0);
  const [negMark1, setNegMark1] = useState();
  const [negMark2, setNegMark2] = useState();
  const [loading, setLoading] = useState(false);

  const totalMark =
    Number(xmInfo.mcq1) * 1 +
    Number(xmInfo.mcq2) * 2 +
    Number(xmInfo.msq1) * 1 +
    Number(xmInfo.msq2) * 2 +
    Number(xmInfo.nat1) * 1 +
    Number(xmInfo.nat2) * 2;

  useEffect(() => {
    if (xmInfo.format === "GATE") {
      setTotalQuestion(65);
      dispatch(setTotalQuestions(65))
      dispatch(setFullMarks(100))
      setFullMark(100);
      setNegMark1(0.33);
      setNegMark2(0.66);
    } else if (xmInfo.format === "NIMCET") {
      setTotalQuestion(120);
      setFullMark(1000);
      dispatch(setTotalQuestions(120))
      dispatch(setFullMarks(1000))
    } else if (xmInfo.format === "CUET(UG)") {
      setTotalQuestion(150);
      setFullMark(750);
      dispatch(setTotalQuestions(120))
      dispatch(setFullMarks(750))
      setNegMark1(-1);
    } else if (xmInfo.format === "CUET(PG)") {
      setTotalQuestion(75);
      setFullMark(300);
      dispatch(setTotalQuestions(75))
      dispatch(setFullMarks(300))
      setNegMark1(-1);
    } else if (xmInfo.format === "JECA") {
      setTotalQuestion(7);
      setFullMark(9);
      dispatch(setTotalQuestions(7))
      dispatch(setFullMarks(9))
      setNegMark1(0.25)
    } else {
      setFullMark(totalMark);
      if (xmInfo.negativeMark) {
        setNegMark1(0.25);
        setNegMark2(0.5);
      }
      const total=xmInfo.mcq1+xmInfo.mcq2+xmInfo.msq1+xmInfo.msq2+xmInfo.nat1+xmInfo.nat2
      setFullMark(total)
      dispatch(setTotalQuestions(total))
      dispatch(setFullMarks(totalMark))
    }
  }, [xmInfo.format, totalMark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (xmInfo.format === "Manual") {
      navigate("/createQuiz");
    } else {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
      }
      try {
        const { exp } = jwtDecode(token);
        if (exp * 1000 < Date.now()) {
          authService.logoutUser();
          navigate("/");
        }
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/generateWithFormat`,
          xmInfo,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          navigate("/success")
        } else if (response.status === 401) {
          navigate("/unauthorized");
        }
        else{
          navigate("/autoGen")
        }
      } catch (error) {
        console.log(error);
        setLoading(false)
      }
    }
  };

  return (
    <div className="w-full flex justify-center items-center px-4 py-8">
      <Navbar />
      {/* Main Card */}
      <div
        className="w-full max-w-2xl rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col gap-6
                      bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
      >
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-indigo-600">
          📘 Question Pattern
        </h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Format */}
          {xmInfo.format !== "Other" && (
            <span className="font-medium">
              Chosen Format:{" "}
              <span className="font-semibold">{xmInfo.format}</span>
            </span>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <span className="font-medium">
              Total Questions:{" "}
              <span className="font-semibold text-indigo-700">
                {totalQuestion}
              </span>
            </span>

            {xmInfo.negativeMark && (
              <span className="font-medium">
                Negative Marks:{" "}
                <span className="font-semibold text-red-500">
                  {xmInfo.format === "GATE" ||
                  xmInfo.format === "Other" ||
                  xmInfo.mcq2 !== 0
                    ? `${negMark1} for 1 mark MCQ and ${negMark2} for 2 marks MCQ`
                    : `${negMark1} for each question`}
                </span>
              </span>
            )}

            <span className="font-medium">
              Full Marks:{" "}
              <span className="font-semibold text-green-600">{fullMark}</span>
            </span>

            <span className="font-medium">
              Duration:{" "}
              <span className="font-semibold text-purple-600">
                {xmInfo.duration} Minutes
              </span>
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:justify-between md:flex-row mt-6 gap-2">
            <button
              type="button"
              className="w-full px-5 py-2 rounded-xl font-medium transition
                         bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() =>
                xmInfo.format !== "Manual"
                  ? navigate("/autoGen")
                  : navigate("/quizDesc")
              }
            >
              ⬅ Previous
            </button>

            <button
              type="submit"
              className="w-full px-6 py-2 rounded-xl font-medium text-white shadow-md transition
                         bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                "✅ Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostSelectionCard;
