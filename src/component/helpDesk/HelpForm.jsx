import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import authService from "../../authentication/auth";
import axios from "axios";

function HelpForm() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!query.trim()) {
      alert("Please enter your query or suggestion.");
      return;
    }
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

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/problem`,
        { query: query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setIsLoading(false);
        alert("Your query has been submitted successfully!");
        setQuery("");
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600 dark:text-blue-400">
          Raise a Query
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-6">
          Have a question, suggestion, or feedback? Let us know below — we'd
          love to hear from you!
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <textarea
            name="query"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your query or suggestion here..."
            rows="5"
            className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-gray-100 resize-none"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-300 shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default HelpForm;
