import React, { useEffect, useState } from "react";
import authService from "../../authentication/auth";
import { useLocation, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbar from "../navbar/Navbar";

function PasswordAuth() {
  const [quizId, setQuizId] = useState();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const qid = location.state?.qid;

  useEffect(() => {
    if (qid) {
      setQuizId(qid);
    }
  }, [qid]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
    try {
      const { exp } = jwtDecode(token);
      if (!exp || exp * 1000 < Date.now()) {
        authService.logout();
        navigate("/");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/passwordAuthentication/${quizId}`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        navigate("/pretest", {
          state: { qid: quizId },
        });
      }
      else if(response.status===404)
      {
        navigate("/noData")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <Navbar/>
      <div className="w-full max-w-md p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
          🔒 Quiz Password Authentication
        </h2>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Quiz ID Input */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Quiz ID
            </label>
            <input
              type="text"
              placeholder="Enter Quiz ID"
              value={quizId + 1000}
              disabled={true}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full mt-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold text-lg tracking-wide shadow-md hover:shadow-lg transition-all duration-300"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordAuth;
