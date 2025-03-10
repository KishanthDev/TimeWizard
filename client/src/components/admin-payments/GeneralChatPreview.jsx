import { Helmet } from "react-helmet";
export default function GeneralChatPreview() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md text-center">
      <Helmet>
        <title>Chat • TimeWizard</title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-4">🚀 General Chat Access Restricted</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        😢 Oops! It looks like your company hasn't unlocked access to the General Chat feature yet.
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        💬 Stay connected with your team in other ways, or let your admin know about this awesome feature! 🚀✨
      </p>
      <div className="flex justify-center space-x-2">
        <span className="text-4xl">🔒</span>
        <span className="text-4xl">💼</span>
        <span className="text-4xl">💡</span>
      </div>
    </div>
  );
}
