import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import authService from "../../authentication/auth";
import axios from "axios";
import { useDispatch } from "react-redux";
import { handleLock } from "../../Store/resultSet";
import Navbar from "../navbar/Navbar";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const qid = location?.state.qid || null;
  const mode = location?.state.mode || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      } else {
        if (mode === "Unlock") {
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/handleUnlock/${qid}`,
            {password},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            dispatch(handleLock(qid));
            navigate("/resultHistory");
          }
        } else {
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/handleLock/${qid}`,
            { password },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            dispatch(handleLock(qid));
            navigate("/resultHistory");
          } else if (response.status === 404) {
            navigate("/noData");
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center mt-16 transition-colors duration-300 p-1">
      <Navbar />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg px-4 py-2 md:p-4 flex flex-col space-y-6"
      >
        <h2 className="text-lg md:text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
          Change Password
        </h2>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor="pass"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            New Password
          </label>
          <input
            id="pass"
            type="password"
            placeholder="Enter the password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 
                       bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       transition duration-200"
          />
        </div>

        <div className="flex justify-between items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate("/resultHistory")}
            className="w-1/2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium text-xs md:text-base
                       py-2 rounded-md transition-colors duration-200 dark:bg-gray-700 dark:text-gray-100"
          >
            Back
          </button>

          <button
            type="submit"
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-base
                       py-2 px-1 rounded-md transition-colors duration-200"
          >
            {mode==="Unlock"?
            "Unlock Quiz":"Lock Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
