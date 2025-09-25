import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { FaUnlockAlt, FaLock } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import authService from "../../authentication/auth";
import axios from "axios";
import { loadData } from "../../Store/resultSet";
import { FaRegEdit } from "react-icons/fa";
import { CiNoWaitingSign } from "react-icons/ci";

function History() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadMsg, setLoadMsg] = useState("Loading Data Please Wait...");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resultSet = useSelector((state) => state.resultInfo);

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
    fetchResultHistory();
  }, []);
  useEffect(() => {
    setIsLoading(resultSet.length === 0);
  }, [resultSet]);

  return (
    <div className="w-full mt-6 p-4 flex flex-col space-y-6">
      <Navbar />
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        📜 History
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {/* Table Header */}
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <tr>
              <th className="px-4 py-2 font-semibold">#</th>
              <th className="px-4 py-2 font-semibold">Obtained Marks</th>
              <th className="px-4 py-2 font-semibold">Full Marks</th>
              <th className="px-4 py-2 font-semibold">Creation Date</th>
              <th className="px-4 py-2 font-semibold">Percentage</th>
              <th className="px-4 py-2 font-semibold">Test</th>
              <th className="px-4 py-2 font-semibold">Edit</th>
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
            ) : (
              resultSet.map((item, index) => (
                <tr
                  key={item.resId ?? index}
                  className="border-t border-gray-200 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">
                    {!item.isPerformed ? "Not Performed" : item.obtainedMarks}
                  </td>
                  <td className="px-4 py-2 text-center">{item.fullMarks}</td>
                  <td className="px-4 py-2 text-center">{item.date}</td>
                  <td className="px-4 py-2 text-center font-medium">
                    {!item.isPerformed
                      ? `${(
                          (Number(item.obtainedMarks) /
                            Number(item.fullMarks)) *
                          100
                        ).toFixed(2)}%`
                      : "N/A"}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center">
                      {!item.isPerformed && item.role === "User" ? (
                        <button
                          className="bg-pink-500 text-white px-3 py-1 rounded-md"
                          onClick={() =>
                            navigate("/pretest", {
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
                          color="yellow"
                          onClick={() => navigate("/remaining")}
                        />
                      ) : (
                        <CiNoWaitingSign
                          size={20}
                          color="yellow"
                          onClick={() => navigate("/remaining")}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center">
                      {item.locked ? (
                        <FaLock
                          size={20}
                          className="text-gray-700 dark:text-gray-300 cursor-pointer"
                          onClick={() => navigate("/remaining")}
                        />
                      ) : (
                        <FaUnlockAlt
                          size={20}
                          className="text-gray-700 dark:text-gray-300 cursor-pointer"
                          onClick={() => navigate("/remaining")}
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
                        onClick={() => navigate("/remaining")}
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
