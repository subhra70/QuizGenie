import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { IoCreateOutline } from "react-icons/io5";
import { FaHistory } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { MdSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa6";
import { useNavigate } from "react-router";

function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("theme")||"light"); // "light" or "dark"
  const navigate = useNavigate();

  // Apply theme to <html> tag
  useEffect(() => {
    if (theme === "dark") {
      localStorage.setItem("theme","dark")
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("theme","light")
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

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
          className={`p-2 rounded-full hover:bg-white transition duration-300 ${hoverColor} flex flex-col items-center`}
        >
          {icon}
           <span className="text-xs">Theme</span>
        </button>
        {showLabel && (
          <span className="absolute top-12 text-xs bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 px-2 py-1 rounded-md shadow-md">
            {label}
          </span>
        )}
      </div>
    );
  };
  return (
    <div className="fixed bottom-0 left-0 w-full md:static md:col-span-1 flex justify-center z-50 md:hidden">
      <nav
        className="
          flex justify-around items-center w-full
          md:flex-col md:justify-start md:items-center md:h-90 md:w-16 md:rounded-full md:fixed md:mt-40 md:space-y-6
          bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-600 text-white shadow-lg
        "
      >
        <IconButton
          icon={theme === "dark" ? <FaMoon size={24} /> : <MdSunny size={24} />}
          label="Theme"
          hoverColor="hover:text-yellow-500"
          onClick={() =>
            setTheme((prev) => (prev === "light" ? "dark" : "light"))
          }
        />
        <button className="p-3 rounded-full hover:bg-white hover:text-blue-600 transition flex flex-col items-center" onClick={() => navigate("/")}>
          <FaHome size={24} />
           <span className="text-xs">Home</span>
        </button>
        <button
          className="p-3 rounded-full hover:bg-white hover:text-purple-600 transition flex flex-col items-center"
          onClick={() => navigate("/selectMethod")}
        >
          <IoCreateOutline size={24} />
           <span className="text-xs">Create</span>
        </button>
        <button className="p-3 rounded-full hover:bg-white hover:text-indigo-600 transition flex flex-col items-center" onClick={()=>navigate("/resultHistory")}>
          <FaHistory size={24} />
           <span className="text-xs">History</span>
        </button>
        <button className="p-3 rounded-full hover:bg-white hover:text-pink-600 transition flex flex-col items-center" onClick={()=>navigate("/userProfile")}>
          <FaRegUserCircle size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
