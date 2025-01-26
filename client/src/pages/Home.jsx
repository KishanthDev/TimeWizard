import Login from "./Login";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-200 flex items-center justify-center py-10 px-4">
          {/* Main Content Container */}
          <div className="bg-white shadow-xl rounded-lg w-full max-w-md p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-indigo-600">Welcome to Time Tracker</h1>
              <p className="text-lg text-gray-700 mt-2">Manage your projects, track tasks, and boost productivity!</p>
            </div>
    
            <Login />
          </div>
        </div>
      );
}
