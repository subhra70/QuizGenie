import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { FaUnlockAlt, FaLock } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import authService from "../../authentication/auth";
import axios from "axios";
import { addQuiz, handleDelete, loadData } from "../../Store/resultSet";
import { FaRegEdit } from "react-icons/fa";
import { CiNoWaitingSign } from "react-icons/ci";

function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadMsg, setLoadMsg] = useState("Loading Data Please Wait...");
  const [searchedQuiz, setSearchedQuiz] = useState();
  const [searchStatus, setSearchStatus] = useState(false);
  const [searchId, setSearchId] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resultSet = useSelector((state) => state.resultInfo) || [];

  useEffect(() => {
    const fetchResultHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Login First");
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
          `${import.meta.env.VITE_API_URL}/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          dispatch(loadData(response.data));
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setLoadMsg("No History Found");
      }
    };
    if (!resultSet || resultSet.length === 0) {
      fetchResultHistory();
    }
  }, [resultSet]);
  useEffect(() => {
    setIsLoading(!resultSet || resultSet.length === 0);
  }, [resultSet]);
  const deleteQuiz = async (id) => {
    setIsLoading(true);
    setLoadMsg("Deleting Quiz...");
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login First");
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
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/quiz/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(handleDelete(id));
        setIsLoading(false);
      } else if (response.status === 404) {
        navigate("/noData");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      return;
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setLoadMsg("Search in progress...");
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login First");
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

      const qid = parseInt(searchId) - 1000;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/quiz/${qid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        setLoadMsg("");
        setSearchStatus(true);
        setSearchedQuiz(response.data);
      } else if (response.status === 404) {
        alert("Quiz Not Found");
        setIsLoading(false);
        setLoadMsg("");
      }
    } catch (error) {
      console.log(error);
      setSearchStatus(false);
      setLoadMsg("");
      setIsLoading(false);
      return;
    }
  };

  const addToHistory = async () => {
    setIsLoading(true);
    setLoadMsg("Adding Quiz To History...");
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login First");
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/addToHistory`,
        { id: searchId - 1000 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        dispatch(addQuiz(response.data));
        setIsLoading(false);
        setLoadMsg("");
        setSearchStatus(false);
        setSearchedQuiz({});
      }
    } catch (error) {
      setIsLoading(false);
      setLoadMsg("");
      setSearchStatus(false);
      setSearchedQuiz({});
      if (error.response && error.response.status === 400) {
        alert("Requested quiz is already present in your history");
      } else if (error.response && error.response.status === 405) {
        alert("You must purchase any one quiz package");
        navigate("/payment");
      } else {
        console.log(error);
      }
      return;
    }
  };

  return (
    <div className="w-full min-h-screen mt-6 p-4 flex flex-col space-y-6">
      <Navbar />
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        📜 History
      </h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0 bg-white dark:bg-gray-900 shadow-md rounded-xl p-3 w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700">
        <input
          type="text"
          placeholder="🔍 Enter Quiz ID..."
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-pink-500 focus:outline-none dark:bg-gray-800 dark:text-gray-100 placeholder-gray-500"
        />
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-5 py-2 rounded-lg transition duration-300 shadow-sm"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {/* Table Header */}
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <tr>
              <th className="px-4 py-2 font-semibold">#</th>
              <th className="px-4 py-2 font-semibold">Quiz Id</th>
              <th className="px-4 py-2 font-semibold">Obtained Marks</th>
              <th className="px-4 py-2 font-semibold">Full Marks</th>
              <th className="px-4 py-2 font-semibold">Creation Date</th>
              <th className="px-4 py-2 font-semibold">Percentage</th>
              <th className="px-4 py-2 font-semibold">Test</th>
              <th className="px-4 py-2 font-semibold">Edit</th>
              <th className="px-4 py-2 font-semibold">Result</th>
              <th className="px-2 py-2 font-semibold">Protect</th>
              <th className="px-2 py-2 font-semibold">Delete</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  {loadMsg}
                </td>
              </tr>
            ) : searchStatus ? (
              <tr>
                <td colSpan="10" className="py-6">
                  <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow-md rounded-2xl border border-gray-200 dark:border-gray-700 p-5 flex flex-col space-y-4 text-gray-800 dark:text-gray-100">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-3">
                      <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400">
                        🎯 Quiz Found
                      </h3>
                      <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md">
                        Quiz ID:{" "}
                        <span className="font-medium">
                          {searchedQuiz.id + 1000}
                        </span>
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Full Marks:</span>
                        <span>{searchedQuiz.fullMarks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Duration:</span>
                        <span>{searchedQuiz.duration} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Negative Marking:</span>
                        <span>
                          {searchedQuiz.negAllow ? "✅ Yes" : "❌ No"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 pt-3 border-t border-gray-300 dark:border-gray-700">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 rounded-lg shadow transition duration-300"
                        onClick={addToHistory}
                      >
                        ➕ Add to History
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg shadow transition duration-300"
                        onClick={() => {
                          setSearchStatus(false);
                          setSearchId("");
                        }}
                      >
                        🔙 Back
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              resultSet.map((item, index) => (
                <tr
                  key={item.resId ?? index}
                  className="border-t border-gray-200 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">
                    {item.quizId + 1000}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {!item.isPerformed ? "Not Performed" : item.obtainedMarks}
                  </td>
                  <td className="px-4 py-2 text-center">{item.fullMarks}</td>
                  <td className="px-4 py-2 text-center">{item.date}</td>
                  <td className="px-4 py-2 text-center font-medium">
                    {item.isPerformed
                      ? `${(
                          (Number(item.obtainedMarks) /
                            Number(item.fullMarks)) *
                          100
                        ).toFixed(2)}%`
                      : "N/A"}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      {!item.isPerformed? (
                        <button
                          className="bg-pink-500 text-white px-3 py-1 rounded-md"
                          onClick={() =>
                            item.locked
                              ? navigate("/passAuth", {
                                  state: { qid: item.quizId },
                                })
                              : navigate("/pretest", {
                                  state: { qid: item.quizId },
                                })
                          }
                        >
                          Give Test
                        </button>
                      ) : (
                        <button
                          className="bg-pink-500 text-white px-3 py-1 rounded-md"
                          onClick={() =>
                            navigate("/answer", {
                              state: { qid: item.quizId },
                            })
                          }
                        >
                          Show Answer
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center">
                      {item.role === "Admin" ? (
                        <FaRegEdit
                          size={20}
                          color="green"
                          onClick={() => navigate("/editQuiz",{state:{qId:item.quizId}})}
                        />
                      ) : (
                        <CiNoWaitingSign
                          size={20}
                          color="red"
                          onClick={()=>alert("You have no permission to edit")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button
                          className="bg-blue-500 text-white px-3 py-1 rounded-md"
                          onClick={() =>
                            navigate("/result", {
                              state: { qid: item.quizId },
                            })
                          }
                        >
                          Leadboard
                        </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center">
                      {item.locked ? (
                        <FaLock
                          size={20}
                          color="blue"
                          className="text-gray-700 dark:text-gray-300 cursor-pointer"
                          onClick={() =>
                            item.role==="Admin"?
                            navigate("/changePass", {
                              state: { qid: item.quizId, mode: "Unlock" },
                            }):alert("You have no permission to Unlock that Quiz")
                          }
                        />
                      ) : (
                        <FaUnlockAlt
                          size={20}
                          className="text-gray-700 dark:text-gray-300 cursor-pointer"
                          color="violet"
                          onClick={() =>
                            item.role==="Admin"?
                            navigate("/changePass", {
                              state: { qid: item.quizId, mode: "Lock" },
                            }):alert("You have no permission to Lock that Quiz")
                          }
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center">
                      <RiDeleteBinFill
                        size={20}
                        color="red"
                        className="cursor-pointer"
                        onClick={() => deleteQuiz(item.resId)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;