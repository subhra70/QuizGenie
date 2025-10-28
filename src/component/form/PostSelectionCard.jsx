import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Navbar from "../navbar/Navbar";
import authService from "../../authentication/auth";
import {jwtDecode} from "jwt-decode";
import { setFullMarks, setTotalQuestions } from "../../Store/examInfo1";
import axios from "axios";

function PostSelectionCard() {
  const xmInfo = useSelector((state) => state.examinationInfo.xminfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const questionsSet = location.state?.questionSet;

  const [totalQuestion, setTotalQuestion] = useState(0);
  const [fullMark, setFullMark] = useState(0);
  const [negMark1, setNegMark1] = useState(0);
  const [negMark2, setNegMark2] = useState(0);
  const [loading, setLoading] = useState(false);

  // Initialize totalQuestion and fullMark from xmInfo
  useEffect(() => {
    if (xmInfo) {
      setFullMark(xmInfo.fullMarks || 0);
      setTotalQuestion(xmInfo.totalQuestion || 0);
    }
  }, [xmInfo]);

  // Update based on format
  useEffect(() => {
    if (!xmInfo) return;

    switch (xmInfo.format) {
      case "GATE":
        setTotalQuestion(65);
        setFullMark(100);
        dispatch(setTotalQuestions(65));
        dispatch(setFullMarks(100));
        setNegMark1(0.33);
        setNegMark2(0.66);
        break;

      case "NIMCET":
        setTotalQuestion(120);
        setFullMark(1000);
        dispatch(setTotalQuestions(120));
        dispatch(setFullMarks(1000));
        break;

      case "CUET(UG)":
        setTotalQuestion(150);
        setFullMark(750);
        dispatch(setTotalQuestions(150));
        dispatch(setFullMarks(750));
        setNegMark1(-1);
        break;

      case "CUET(PG)":
        setTotalQuestion(75);
        setFullMark(300);
        dispatch(setTotalQuestions(75));
        dispatch(setFullMarks(300));
        setNegMark1(-1);
        break;

      case "JECA":
        setTotalQuestion(100);
        setFullMark(120);
        dispatch(setTotalQuestions(100));
        dispatch(setFullMarks(120));
        setNegMark1(0.25);
        break;

      case "Manual":
        if (Array.isArray(questionsSet)) {
          const fm = questionsSet.reduce(
            (sum, item) => sum + (item.mark || 0),
            0
          );
          setFullMark(fm);
          dispatch(setFullMarks(fm));
        }
        break;

      default:
        { if (xmInfo.negativeMark) {
          setNegMark1(0.25);
          setNegMark2(0.5);
        }
        const total = xmInfo.mcq1 + xmInfo.mcq2 * 2 + xmInfo.msq1 + xmInfo.msq2 * 2 + xmInfo.nat1 + xmInfo.nat2 * 2;
        setFullMark(total);
        dispatch(setFullMarks(total));
        break; }
    }
  }, [xmInfo.format, questionsSet, xmInfo, dispatch]);

  const handleSubmit = async (e) => {
    if(!xmInfo)
    {
      navigate("/")
      return
    }
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    let exp;
    try {
      exp = jwtDecode(token).exp;
    } catch (err) {
      console.log(err)
      authService.logout();
      navigate("/");
      return;
    }

    if (!exp || exp * 1000 < Date.now()) {
      authService.logout();
      navigate("/");
      return;
    }

    try {
      if (xmInfo.format === "Manual") {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/manualCreation`,
          {
            quizDetails: xmInfo,
            questionDetails: questionsSet,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Manual quiz created successfully");
        navigate("/success");
      } else {
        console.log(`${import.meta.env.VITE_API_URL}`)
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/generateWithFormat`,
          xmInfo,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) navigate("/success");
        else if (response.status === 401) navigate("/unauthorized");
        else if (response.status === 500) navigate("/netErr");
        else navigate("/autoGen");
      }
    } catch (error) {
      console.error(error);
      navigate("/netErr");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center px-1 py-12">
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

        <div className="w-full bg-red-300 p-2 rounded-md">
          <b>Note:</b> In case of auto generation, AI may not generate exact
          number of questions that you have specified. We will fix it soon.
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {xmInfo.format !== "Other" && (
            <span className="font-medium">
              Chosen Format:{" "}
              <span className="font-semibold">{xmInfo.format}</span>
            </span>
          )}

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
                  (xmInfo.mcq2 || 0) !== 0
                    ? `${negMark1} for 1 mark MCQ and ${
                        negMark2 || 0
                      } for 2 marks MCQ`
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

          <div className="flex flex-col md:flex-row md:justify-between mt-6 gap-2">
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
