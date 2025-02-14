import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-red-500 text-3xl font-bold">Payment Canceled! ❌</h1>
      <p className="mt-2">You have canceled the payment process.</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => navigate("/pricing")}
      >
        Try Again
      </button>
    </div>
  );
};

export default Cancel;
