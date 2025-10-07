import React, { useState } from "react";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function PaymentCard() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const plans = [
    {
      id: 1,
      price: "169",
      features: [
        "60 Manual Quiz Creation",
        "30 Times Auto Generation",
        "Unlimited test created by others",
        "One Month Validity",
      ],
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 2,
      price: "499",
      features: [
        "200 Manual Quiz Creation",
        "100 Times Auto Generation",
        "Unlimited test created by others",
        "Three Month Validity",
      ],
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 3,
      price: "1199",
      features: [
        "Unlimited Manual Quiz Creation",
        "Unlimited Auto Generation",
        "Unlimited test created by others",
        "One Year Validity",
      ],
      color: "from-purple-500 to-pink-500",
    },
  ];
  const handlePurchase = async (id) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    try {
      const { exp } = jwtDecode(token);
      if (exp * 1000 < Date.now()) {
        authService.logout();
        navigate("/");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/purchase/${id}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        setIsLoading(false);
        alert("Purchase successfull");
        navigate("/");
      } else if (response.status === 401) {
        setIsLoading(false);
        authService.logout();
        navigate("/unauthorized");
      }
    } catch (error) {
      setIsLoading(false);
      alert("Purchase unsuccessfull");
      console.log(error);
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
    <div className="flex min-h-screen flex-col justify-center">
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center md:space-x-6 space-y-6 md:space-y-0 p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 rounded-2xl">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between w-full md:w-1/3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="w-full p-6 flex flex-col items-center space-y-4">
              <h1
                className={`text-3xl font-bold bg-gradient-to-r ${plan.color} text-transparent bg-clip-text`}
              >
                ₹{plan.price}
              </h1>
              <ul className="space-y-2 text-center text-gray-700 dark:text-gray-300">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-sm md:text-base">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button
              className={`w-full py-2 font-semibold text-white rounded-b-xl bg-gradient-to-r ${plan.color} hover:opacity-90 transition-opacity duration-200`}
              onClick={() => handlePurchase(plan.id)}
            >
              Purchase
            </button>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col p-6 rounded-md bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300 mb-12">
        <span className="text-lg font-bold text-red-500">Important Note</span>
        <span className="text-sm md:text-base dark:text-gray-100 text-gray-900">
          You may request a refund if you are not satisfied with our platform.
          Refund requests must be made within 48 hours of purchase. Please send
          an email to the address provided at the bottom of this page,
          explaining the issues you faced with our platform. We will review your
          request, and if it is found valid, a refund will be issued after
          deducting a 10% service charge. If your request is deemed invalid, no
          refund will be provided. In both cases, you will receive an email
          response with supporting details.
        </span>
      </div>
    </div>
  );
}

export default PaymentCard;
