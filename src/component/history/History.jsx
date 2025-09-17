import React, { useState } from "react";
import Navbar from "../navbar/Navbar";

function History() {
  const [result, setResult] = useState([
    { marks: 45, fullMarks: 50, date: "2025-09-14" },
    { marks: 72, fullMarks: 100, date: "2025-09-12" },
    { marks: 38, fullMarks: 50, date: "2025-09-10" },
  ]);

  return (
    <div className="w-full mt-6 p-4 flex flex-col space-y-6">
        <Navbar/>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        📜 Result History
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          {/* Table Header */}
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
            <tr>
              <th className="px-4 py-2  font-semibold">#</th>
              <th className="px-4 py-2  font-semibold">Obtained Marks</th>
              <th className="px-4 py-2  font-semibold">Full Marks</th>
              <th className="px-4 py-2  font-semibold">Date</th>
              <th className="px-4 py-2  font-semibold">Percentage</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {result.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-200 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.marks}</td>
                <td className="px-4 py-2">{item.fullMarks}</td>
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2 font-medium">
                  {((item.marks / item.fullMarks) * 100).toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
