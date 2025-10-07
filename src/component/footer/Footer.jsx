import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 py-16 md:py-6 border-t border-gray-300 dark:border-gray-700 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* About Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
            About QuizGenie
          </h1>
          <p className="text-sm leading-relaxed">
            QuizGenie is an AI-powered platform to help you prepare for
            competitive exams. Generate customized quizzes, share them with
            friends, and boost your preparation effortlessly.
          </p>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
            Contact Us
          </h1>
          <p className="text-sm mb-2">
            Have questions or suggestions? We're here to help!
          </p>
          <ul className="space-y-2">
            <li className="flex items-center justify-center md:justify-start gap-2">
              <FaEnvelope className="text-blue-500" />
              <span>teamquizgenie@gmail.com</span>
            </li>
            <li>
              <Link
                to="/helpDesk"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-600 transition-colors duration-300"
              >
                Raise Query
              </Link>
            </li>
          </ul>
        </div>

        {/* Social & Copyright */}
        <div className="flex flex-col items-center md:items-start">
          <h1 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
            Follow Us
          </h1>
          <div className="flex gap-4 text-xl mb-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-500 transition-colors duration-300"
            >
              <FaFacebook />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition-colors duration-300"
            >
              <FaInstagram />
            </a>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
            © {new Date().getFullYear()} QuizGenie. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
