import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkoutSuccess } from "../../slices/subscriptionSlice";

const Success = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    dispatch(checkoutSuccess());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimeout = setTimeout(() => {
      navigate("/admin");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-green-500 text-3xl font-bold">Payment Successful! 🎉</h1>
      <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
        You will be redirected to the dashboard in <span className="font-bold">{countdown}</span> seconds.
      </p>
      <button
        onClick={() => navigate("/admin")}
        className="mt-6 px-6 py-2 bg-blue-500 text-white text-lg rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Go to Dashboard Now
      </button>
    </div>
  );
};

export default Success;
