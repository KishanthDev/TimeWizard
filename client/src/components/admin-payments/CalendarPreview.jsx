import { Link } from "react-router-dom";

const CalendarPreview = () => {
  return (
    <div className="p-5 bg-white  dark:bg-gray-800 dark:text-gray-300 shadow rounded mx-auto mt-10">
      {/* Pro Features Header */}
      <div className="flex justify-between items-center bg-blue-100 dark:bg-gray-700 p-4 rounded mb-6">
        <h2 className="text-lg font-semibold text-blue-700 dark:text-gray-200">
          📅 Unlock the Activity Calendar
        </h2>
        <Link
          to="/subscribe"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Upgrade to Basic
        </Link>
      </div>

      {/* Calendar Benefits */}
      <h2 className="text-xl font-bold mb-4">Why Use the Activity Calendar?</h2>
      <p className="mb-4 text-gray-700 dark:text-gray-400">
        The Activity Calendar helps you **visualize and plan work schedules efficiently**.
        With this feature, you can:
      </p>

      <ul className="list-disc pl-5 space-y-2 text-gray-800 dark:text-gray-300">
        <li>📆 View **employee activity logs** on a calendar.</li>
        <li>🕒 Track **clock-in & clock-out** timings visually.</li>
        <li>✅ See **task deadlines and completions** at a glance.</li>
        <li>🔍 Filter logs by **date, project, and employees**.</li>
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

export default CalendarPreview;
