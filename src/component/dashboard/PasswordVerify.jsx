import React, { useState } from "react";
import { useNavigate } from "react-router";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function PasswordVerify() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/adminVerify`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        navigate("/adminDashboard");
        return;
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter Password:"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}

export default PasswordVerify;
