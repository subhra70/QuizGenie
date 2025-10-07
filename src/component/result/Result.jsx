import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";

function Result() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const quizId = location.state?.qid;

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
          `${import.meta.env.VITE_API_URL}/result/${quizId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          setData(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [quizId, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 dark:text-gray-300 text-lg">
        No results found 😕
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 px-4 sm:px-8 py-8">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-blue-600 dark:text-blue-400">
          🏆 Quiz Leaderboard
        </h2>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-blue-600 dark:bg-blue-700 text-white text-center">
                <th className="py-3 px-4 rounded-tl-xl">Rank</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Obtained Marks</th>
                <th className="py-3 px-4 rounded-tr-xl">Full Marks</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => {
                let rankIcon = idx + 1;
                if (idx === 0) rankIcon = "🥇";
                else if (idx === 1) rankIcon = "🥈";
                else if (idx === 2) rankIcon = "🥉";

                return (
                  <tr
                    key={idx}
                    className={`border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                      idx % 2 === 0
                        ? "bg-gray-100/50 dark:bg-gray-800/40"
                        : "bg-white dark:bg-gray-800"
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold">{rankIcon}</td>
                    <td className="py-3 px-4">{item.quizUser.name}</td>
                    <td className="py-3 px-4 text-green-600 dark:text-green-400 font-semibold">
                      {item.obtainedMark}
                    </td>
                    <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold">
                      {item.quizClass.fullMarks}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition"
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default Result;
