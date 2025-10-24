import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { jwtDecode } from "jwt-decode";
import { GiExitDoor } from "react-icons/gi";
import { FaUserCircle, FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router";
import authService from "../../authentication/auth";
import axios from "axios";

function UserProfile() {
  const [profile, setProfile] = useState({
    img: "",
    name: "N/A",
    gmail: "N/A",
    isPremium: false,
  });
  const [isdisable, setIsdisable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
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
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          setProfile({
            img: data.user.picture,
            name: data.user.name,
            gmail: data.user.email,
            isPremium: data.premium,
          });
          setIsdisable(false);
        } else {
          navigate("/unauthorized");
        }
      } catch (e) {
        console.log(e);
        authService.logout();
        navigate("/");
      }
    };

    init();
  }, [navigate]);

  const handleSignout = async () => {
    authService.logout();
    window.dispatchEvent(new Event("userChanged"));
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen mt-8 bg-gradient-to-br from-indigo-100 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-10 px-6">
        {/* Profile Header */}
        <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400">
          👤 User Profile
        </h1>

        {/* Profile Card */}
        <div className="w-full max-w-2xl rounded-2xl shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-8 transition-all duration-500 hover:scale-[1.02]">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.img ? (
                <img
                  src={profile.img}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300"
                />
              ) : (
                <FaUserCircle className="w-32 h-32 text-gray-400 dark:text-gray-600" />
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left space-y-3">
              {/* Stylish Name Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2">
                {profile.isPremium && (
                  <FaCrown
                    className="text-yellow-400 animate-bounce sm:animate-none"
                    size={22}
                    title="Premium User"
                  />
                )}
                <h2
                  className={`text-2xl sm:text-3xl font-extrabold tracking-wide ${
                    profile.isPremium
                      ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300 text-transparent bg-clip-text drop-shadow-md"
                      : "text-gray-800 dark:text-gray-100"
                  }`}
                >
                  {profile.name}
                </h2>
              </div>

              {/* Email */}
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base break-all">
                {profile.gmail}
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                {profile.gmail === "shawsubhra68@gmail.com" && (
                  <button
                    className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl shadow-md transition duration-300 hover:shadow-lg"
                    onClick={() => navigate("/adminDashboard704")}
                  >
                    Admin Dashboard
                  </button>
                )}

                {!profile.isPremium && (
                  <button
                    className="px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-xl shadow-md transition duration-300 hover:shadow-lg"
                    onClick={() => navigate("/payment")}
                  >
                    Upgrade to Premium
                  </button>
                )}
                {/* <button
                  className="px-5 py-2.5 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-xl shadow-md transition duration-300 hover:shadow-lg"
                  onClick={() => navigate("/payment")}
                >
                  Upgrade to Premium
                </button> */}
              </div>
            </div>

            {/* Sign Out */}
            <button
              className="flex items-center gap-2 px-5 py-2.5 mt-6 md:mt-0 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-md transition duration-300 hover:shadow-lg"
              onClick={handleSignout}
              disabled={isdisable}
            >
              <span>Sign Out</span>
              <GiExitDoor size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
