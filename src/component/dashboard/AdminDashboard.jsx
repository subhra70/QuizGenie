import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import authService from "../../authentication/auth";
import { RiDeleteBinFill } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Navbar from "../navbar/Navbar";

function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [selected, setSelected] = useState("Users");
  const [viewProblem, setViewProblem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
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
        `${import.meta.env.VITE_API_URL}/allUsers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setData(response.data);
      } else if (response.status === 401) {
        navigate("/unauthorized");
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProblems = async () => {
    setSelected("Problems");
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

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/problems`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) setAllProblems(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async(id) => {
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
      
      const response=await axios.put(`${import.meta.env.VITE_API_URL}/problem/${id}`,null,{headers:{
        Authorization:`Bearer ${token}`
      }})
      if(response.status===200)
      {
        setAllProblems(response.data)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  };

  const deleteProblem=async(id)=>{
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

      
      const response=await axios.delete(`${import.meta.env.VITE_API_URL}/problem/${id}`,{headers:{
        Authorization:`Bearer ${token}`
      }})
      if(response.status===200)
      {
        setAllProblems(response.data)
        setIsLoading(false)
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <Navbar/>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between md:items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
            Admin Dashboard
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelected("Users");
                fetchAllUsers();
              }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selected === "Users"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              Users
            </button>
            <button
              onClick={fetchProblems}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                selected === "Problems"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 hover:text-white"
              }`}
            >
              Problems
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 md:p-6 overflow-x-auto">
          {selected === "Users" ? (
            // === USERS TABLE ===
            <table className="min-w-full border-collapse text-sm md:text-base">
              <thead className="bg-blue-600 dark:bg-blue-700 text-white">
                <tr>
                  {[
                    "#",
                    "User Name",
                    "Premium",
                    "Amount",
                    "Purchased Date",
                    "Delete",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className={`px-4 py-3 font-semibold ${
                        header === "Delete" ? "text-center" : ""
                      }`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium">
                        {item.user?.name}
                      </td>
                      <td className="px-4 py-3">
                        {item.premium ? (
                          <span className="text-green-600 font-semibold">
                            Yes
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.premium ? `₹${item.amount}` : "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {item.purchasedDate || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="text-red-600 hover:text-red-800 transition-transform transform hover:scale-110"
                          title="Delete User"
                        >
                          <RiDeleteBinFill size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No user data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            // === PROBLEMS TABLE ===
            <table className="min-w-full border-collapse text-sm md:text-base">
              <thead className="bg-blue-600 dark:bg-blue-700 text-white">
                <tr>
                  {["#", "Name", "Raised Date", "Solve Status", "Problem","Delete"].map(
                    (header, idx) => (
                      <th
                        key={idx}
                        className={`px-4 py-3 font-semibold ${
                          header === "Problem" ? "text-center" : ""
                        }`}
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {allProblems.length > 0 ? (
                  allProblems.map((problem, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-4 py-3">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium capitalize">
                        {problem.user.name}
                      </td>
                      <td className="px-4 py-3">
                        {problem.raisedDate || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleStatusToggle(problem.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                            problem.solveStatus
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-yellow-500 hover:bg-yellow-600 text-white"
                          }`}
                        >
                          {problem.solveStatus ? "Solved" : "Pending"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setViewProblem(problem)}
                          className="px-4 py-1 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-transform transform hover:scale-105"
                        >
                          View Problem
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          className="text-red-600 hover:text-red-800 transition-transform transform hover:scale-110"
                          title="Delete Problem"
                          onClick={()=>deleteProblem(problem.id)}
                        >
                          <RiDeleteBinFill size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                      No problems found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Problem Modal */}
      {viewProblem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 md:p-8 relative scale-100 hover:scale-105 transition-transform duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              Problem Raised by {viewProblem.user.name || "Anonymous"}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              <strong>Date:</strong> {viewProblem.raisedDate || "N/A"}
            </p>
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl max-h-60 overflow-y-auto text-gray-800 dark:text-gray-200">
              {viewProblem.problem || "No problem details provided."}
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button
                onClick={() => setViewProblem(null)}
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
