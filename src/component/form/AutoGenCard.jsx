import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { loadData, setTotalQuestions } from "../../Store/examInfo1";
import Navbar from "../navbar/Navbar";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { loadUserData } from "../../Store/userInfo";

function AutoGenCard() {
  const [showDetail, setShowDetail] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [negAllow, setNegAllow] = useState(true);
  const questionData = useSelector((state) => state.examinationInfo.xminfo);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(false);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState({
    format: questionData.format || "",
    neg: questionData.negativeMark || true,
    mcq1: questionData.mcq1 || 0,
    mcq2: questionData.mcq2 || 0,
    msq1: questionData.msq1 || 0,
    msq2: questionData.msq2 || 0,
    nat1: questionData.nat1 || 0,
    nat2: questionData.nat2 || 0,
    duration: questionData.duration || 0,
    description: questionData.description || "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      } catch (error) {
        console.log(error);
        authService.logout();
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [navigate, dispatch]);
  const handleSelection = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setShowDetail(true);
      setData((prev) => ({ ...prev, format: value }));
    } else {
      setShowDetail(false);
      setData((prev) => ({ ...prev, format: value }));
    }
  };

  const handleChange = (e) => {
    const value = e.target.value === "yes";
    setNegAllow(e.target.value);
    setData({ ...data, neg: value });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = [
      "mcq1",
      "mcq2",
      "msq1",
      "msq2",
      "nat1",
      "nat2",
      "duration",
    ];
    setData({
      ...data,
      [name]: numericFields.includes(name) ? parseInt(value || 0) : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userInfo.freeTrialAutogen <= 0) {
      alert("Purchase a package to continue");
      navigate("/payment");
      return;
    }
    setIsSubmit(true);
    dispatch(loadData(data));
    if (data.format === "Other") {
      if (
        total !=
        data.mcq1 + data.msq2 + data.msq1 + data.msq2 + data.nat1 + data.nat2
      ) {
        setError(true);
        setIsSubmit(false);
        return;
      } else {
        setIsSubmit(false);
        dispatch(setTotalQuestions(total));
      }
    }
    navigate("/confirmPost");
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
    <div className="flex flex-col items-center px-4 py-12 mt-6 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl text-blue-600 font-extrabold mb-6 tracking-wide">
        Generation Description
      </h1>
      {/* Free Trial Info */}
      {userInfo?.freeTrialAutogen >= 0 && !userInfo?.premium && (
        <div className="mb-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-semibold rounded-lg shadow-md">
          Free Trial Remaining:{" "}
          <span className="text-blue-700 dark:text-blue-300 font-bold">
            {userInfo?.freeTrialAutogen}
          </span>
        </div>
      )}
      {userInfo?.freeTrialAutogen >= 0 &&
        userInfo?.premium &&
        userInfo?.monthDuration < 12 && (
          <div className="mb-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 font-semibold rounded-lg shadow-md">
            Trial Remaining:{" "}
            <span className="text-blue-700 dark:text-blue-300 font-bold">
              {userInfo.freeTrialAutogen}
            </span>
          </div>
        )}

      {/* Form Container */}
      <form
        className="w-full max-w-2xl bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 shadow-xl dark:shadow-[0_4px_12px_rgba(255,255,255,0.15)]
 rounded-2xl p-6 md:p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        {/* Examination Format */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="format"
            className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 text-lg"
          >
            Examination Format
          </label>
          <select
            name="format"
            id="format"
            defaultValue={data.format}
            onChange={(e) => {
              handleSelection(e);
              setData({ ...data, format: e.target.value });
            }}
            className="border rounded-lg px-3 py-2 focus:outline-none bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Choose Format
            </option>
            <option value="GATE">GATE</option>
            <option value="NIMCET">NIMCET</option>
            <option value="CUET(UG)">CUET(UG)</option>
            <option value="CUET(PG)">CUET(PG)</option>
            <option value="JECA">JECA</option>
            <option value="Other">Other</option>
          </select>
        </div>
        {!showDetail && (
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="desc"
              className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 text-lg"
            >
              Specify Details
            </label>
            <textarea
              name="description"
              id="description"
              required
              value={data.desc}
              onChange={handleInputChange}
              rows="4"
              placeholder="Specify a concise description about the exam (Language of question,Subject and Syllabus(topics only not details). Don't use not more than 70 words."
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
            ></textarea>
          </div>
        )}

        {/* Number of Questions & Negative Marking */}
        {showDetail && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2 relative">
              <label
                htmlFor="qno"
                className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
              >
                No. of Questions
              </label>
              <input
                type="number"
                name="qno"
                placeholder="Enter number"
                value={total == 0 ? "" : total}
                onChange={(e) => {
                  setTotal(parseInt(e.target.value) || 0);
                  setError(false); // clear error when user changes input
                }}
                className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                } bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300`}
                required
              />
              {error && (
                <span className="text-sm text-red-500 absolute -bottom-5">
                  Total questions must match the sum of all types below
                </span>
              )}
            </div>

            <div className="flex flex-col space-y-2 items-center">
              <span className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
                Negative Marking
              </span>
              <div className="flex gap-x-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="negAllow"
                    checked={negAllow === true}
                    onChange={handleChange}
                    className="accent-blue-600 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                    value="yes"
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="negAllow"
                    checked={negAllow === false}
                    onChange={handleChange}
                    className="accent-blue-600 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                    value="no"
                  />
                  No
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Question Details */}
        {showDetail && (
          <>
            <h2 className="text-2xl font-bold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 border-b pb-2">
              Question Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* MCQ */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="mcq1"
                  className="font-medium bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                >
                  MCQ (1 Mark)
                </label>
                <input
                  type="number"
                  name="mcq1"
                  value={data.mcq1 !== 0 ? data.mcq1 : ""}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="mcq2"
                  className="font-medium bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                >
                  MCQ (2 Marks)
                </label>
                <input
                  type="number"
                  name="mcq2"
                  value={data.mcq2 !== 0 ? data.mcq2 : ""}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>

              {/* MSQ */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="msq1"
                  className="font-medium bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                >
                  MSQ (1 Mark)
                </label>
                <input
                  type="number"
                  name="msq1"
                  value={data.msq1 !== 0 ? data.msq1 : ""}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="msq2"
                  className="font-medium bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                >
                  MSQ (2 Marks)
                </label>
                <input
                  type="number"
                  name="msq2"
                  value={data.msq2 !== 0 ? data.msq2 : ""}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>

              {/* NAT */}
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="nat1"
                  className="font-medium bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                >
                  NAT (1 Mark)
                </label>
                <input
                  type="number"
                  name="nat1"
                  value={data.nat1 !== 0 ? data.nat1 : ""}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label
                  htmlFor="nat2"
                  className="font-medium bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                >
                  NAT (2 Marks)
                </label>
                <input
                  type="number"
                  name="nat2"
                  value={data.nat2 !== 0 ? data.nat2 : ""}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
                />
              </div>
            </div>
          </>
        )}

        {/* Duration */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="duration"
            className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
          >
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={data.duration !== 0 ? data.duration : ""}
            onChange={handleInputChange}
            required
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
          />
        </div>

        {/* Examination Description */}
        {showDetail && (
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="desc"
              className="font-semibold bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 text-lg"
            >
              Examination Description
            </label>
            <textarea
              name="description"
              id="description"
              value={data.desc}
              onChange={handleInputChange}
              rows="4"
              required
              placeholder="Mention the examination name, syllabus, language, question format, marks per question etc information so that genertion can be accurate.."
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300"
            ></textarea>
          </div>
        )}

        {/* Submit Button */}
        <button
          disabled={isSubmit}
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Next
        </button>
      </form>
    </div>
  );
}

export default AutoGenCard;
