import { Link } from "react-router-dom";

const ActivityPreview = () => {
  return (
    <div className="p-5 bg-white  dark:bg-gray-800 dark:text-gray-300 shadow rounded  mx-auto mt-10">
      {/* Pro Features Header */}
      <div className="flex justify-between items-center bg-blue-100 dark:bg-gray-700 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold text-blue-700 dark:text-gray-200">
          🚀 Unlock Pro Features
        </h2>
        <Link
          to="/subscribe"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upgrade to Basic
        </Link>
      </div>

      {/* Activity Log Benefits */}
      <h2 className="text-xl font-bold mb-4">Why Use the Activity Log?</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-400">
        The Activity Log helps you monitor employee work in real time.
        With this feature, you can:
      </p>

      <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-300">
        <li>📌 Track **Clock-in & Clock-out** times.</li>
        <li>✅ Monitor **Task Completion** by employees.</li>
        <li>📊 Get insights into **employee productivity**.</li>
        <li>🔍 View logs with **filters & sorting**.</li>
      </ul>

      {/* Upgrade CTA */}
      <div className="mt-6 text-center">
        <Link
          to="/subscribe"
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
        >
          Upgrade to Basic Plan 🚀
        </Link>
      </div>
    </div>
  );
};

export default ActivityPreview;
