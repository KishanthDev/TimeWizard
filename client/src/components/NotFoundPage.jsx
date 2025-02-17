import { useSelector } from "react-redux";
import { Link } from "react-router-dom"


const NotFoundPage = () => {
    const {user} =  useSelector(state=>state.user)
  return (
    <div className="flex flex-col items-center justify-center mt-32 bg-gray-900 text-white text-center">
      <h1 className="text-6xl font-bold mb-4 animate-pulse">404</h1>
      
      <p className="text-xl mb-2">🤔 Oops... You seem lost!</p>
      <p className="text-gray-400 mb-6">Maybe the page took a vacation? 🏖️</p>

      <Link
        to={user.role==="admin"?"/admin":"/emp"}
        className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
      >
        Go Home
      </Link>

      <div className="mt-10 text-gray-500 text-sm">
        <p className="animate-bounce">🚀 Don't worry, we'll teleport you back soon!</p>
      </div>
    </div>
  );
};

export default NotFoundPage;
