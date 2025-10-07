import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { jwtDecode } from "jwt-decode";
import { GiExitDoor } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import authService from "../../authentication/auth";
import axios from "axios";

function UserProfile() {
  const [profile, setProfile] = useState({
    img: "", // empty means no image
    name: "N/A",
    gmail: "N/A",
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
          // Token expired
          authService.logout();
          navigate("/");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          const user = response.data;
          setProfile({
            img: user.picture,
            name: user.name,
            gmail: user.email,
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
    <div className="flex mt-10 flex-col min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="flex flex-col items-center mt-8 px-4">
        {/* Profile Header */}
        <h1 className="text-2xl font-semibold mb-6">👤 Profile</h1>

        {/* Profile Card */}
        <div className="w-full max-w-2xl rounded-xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
            {/* Avatar */}
            {profile.img ? (
              <img
                src={profile.img}
                alt="Profile"
                className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-700 shadow-md"
              />
            ) : (
              <FaUserCircle className="w-28 h-28 text-gray-400 dark:text-gray-600" />
            )}

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.gmail}
              </p>
            </div>

            {/* Sign Out */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow transition duration-300"
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
