import React, { useState, useEffect } from "react";
import { FaHome, FaHistory, FaRegUserCircle } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { MdSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa6";
import { useNavigate } from "react-router";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";

function Header() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [image, setImage] = useState(localStorage.getItem("image") || null);
  const navigate = useNavigate();

  // Theme handling
  useEffect(() => {
    if (theme === "dark") {
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
    
  }, [theme]);
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const { exp } = jwtDecode(token);
    if (exp * 1000 < Date.now()) {
      authService.logoutUser();
      navigate("/");
    }
  } catch (e) {
    // Invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("image");
    console.log("Invalid token", e);
    navigate("/");
  }
}, [navigate]);


  // Capture token, name, image from URL params once
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const profileImage = decodeURIComponent(params.get("image"));

    if (token) {
      localStorage.setItem("token", token);
      if (profileImage) {
        localStorage.setItem("image", profileImage);
        setImage(profileImage);
        window.dispatchEvent(new Event("userChanged"));
      }
      navigate("/");
    }
  }, [navigate]);

  // Reusable Icon Button
  const IconButton = ({ icon, label, onClick, hoverColor }) => {
    const [showLabel, setShowLabel] = useState(false);

    return (
      <div
        className="relative flex flex-col items-center"
        onMouseEnter={() => setShowLabel(true)}
        onMouseLeave={() => setShowLabel(false)}
      >
        <button
          onClick={onClick}
          className={`p-2 rounded-full hover:bg-white transition duration-300 ${hoverColor}`}
        >
          {icon}
        </button>
        {showLabel && (
          <span className="absolute top-12 text-xs bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 px-2 py-1 rounded-md shadow-md">
            {label}
          </span>
        )}
      </div>
    );
  };

  return (
    <header className="w-full fixed top-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-lg z-50">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Left - Brand */}
        <h1
          className="text-xl sm:text-2xl font-extrabold text-white tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          QuizGenie
        </h1>

        {/* Middle - Nav */}
        <nav className="hidden md:flex space-x-6 items-center">
          <IconButton
            icon={
              theme === "dark" ? <FaMoon size={22} /> : <MdSunny size={22} />
            }
            label="Theme"
            hoverColor="hover:text-yellow-400"
            onClick={() =>
              setTheme((prev) => (prev === "light" ? "dark" : "light"))
            }
          />
          <IconButton
            icon={<FaHome size={22} />}
            label="Home"
            hoverColor="hover:text-yellow-400"
            onClick={() => navigate("/")}
          />
          <IconButton
            icon={<IoCreateOutline size={22} />}
            label="Create"
            hoverColor="hover:text-yellow-400"
            onClick={() => navigate("/selectMethod")}
          />
          <IconButton
            icon={<FaHistory size={22} />}
            label="History"
            hoverColor="hover:text-yellow-400"
            onClick={() => navigate("/resultHistory")}
          />
          <IconButton
            icon={<FaRegUserCircle size={22} />}
            label="Profile"
            hoverColor="hover:text-yellow-400"
            onClick={() => navigate("/userProfile")}
          />
        </nav>

        {/* Right - Profile / Login */}
        {image !== null ? (
          <div className="flex items-center space-x-2">
            <img
              src={image}
              alt="Profile"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white shadow-md"
            />
          </div>
        ) : (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-800 transition"
            onClick={() =>
              (window.location.href = `${
                import.meta.env.VITE_API_URL
              }/oauth2/authorization/google`)
            }
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
