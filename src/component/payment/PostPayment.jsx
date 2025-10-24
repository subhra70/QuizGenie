import axios from "axios";
import React, { useEffect, useState } from "react";
import authService from "../../authentication/auth";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router";

function PostPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState();
  const [coupon, setCoupon] = useState("");
  const [isdisable,setIsdisable]=useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const planId = location.state?.pid || null;

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

  useEffect(() => {
    if (planId !== null) {
      setPrice(plans[planId - 1].price);
      return;
    }
  }, [planId]);

  const handlePurchase = async () => {
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
        return;
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/purchase/${price}`,
        {"PlanId":plans[planId-1].id},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.error) {
        alert("Error creating order: " + data.error);
        return;
      }

      const options = {
        key: "rzp_test_RRMjthnZWbsrhf",
        amount: price,
        currency: data.currency,
        name: "Quiz Platform",
        description: "Plan Purchase",
        order_id: data.id,
        handler: async function (response) {
          try {
            const res = await axios.post(
              `${import.meta.env.VITE_API_URL}/verifyPayment`,
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.status === 200) {
              alert("Payment successful!");
              navigate("/");
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification error");
          } finally {
            setIsLoading(false);
          }
        },
        theme: { color: "#4F46E5" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error(error);
      alert("Payment failed!");
    } finally {
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 sm:p-10 w-full max-w-md transition-all">
        <h1 className="text-2xl sm:text-3xl font-bold text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text mb-6">
          Payment Details
        </h1>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Plan Features:
          </h2>
          <ul className="space-y-1 list-disc list-inside text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {plans[planId - 1].features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-3 mb-4">
          <div className="flex-1">
            <label
              htmlFor="coupon"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Apply Coupon (If Any)
            </label>
            <input
              id="coupon"
              type="text"
              placeholder="Enter Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              if (coupon === "HFX40CT") {
                setPrice(price-Math.ceil(price * 0.4));
                setIsdisable(true)
                alert("Coupon applied successfully!");
              } else {
                alert("Invalid Coupon Code!");
              }
            }}
            disabled={isdisable}
            className="mt-3 sm:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-md transition-all"
          >
            {isdisable?"Applied":"Apply"}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6 text-lg font-semibold text-gray-800 dark:text-gray-200">
          <span>Total Amount:</span>
          <span>₹{price}</span>
        </div>

        <button
          onClick={handlePurchase}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all"
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
}

export default PostPayment;
