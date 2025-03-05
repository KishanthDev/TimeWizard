import { useEffect, useState } from "react";
import axios from "../config/axios";
import { Loader2, Send, Mail, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";

const SupportPage = () => {
  const user = useSelector((state) => state.user.user);
  const [form, setForm] = useState({ name: user.username, email: user.email, message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loadingQueries, setLoadingQueries] = useState(true);

  // Fetch user's queries
  useEffect(() => {
    fetchMyQueries();
  }, []);

  const fetchMyQueries = async () => {
    setLoadingQueries(true);
    try {
      const res = await axios.get("/api/support/my-queries",{headers:{Authorization:localStorage.getItem("token")}});
      setQueries(res.data);
    } catch (error) {
      console.error("Error fetching queries", error);
    }
    setLoadingQueries(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/support/contact", form,{headers:{
        Authorization:localStorage.getItem("token")
      }});
      setSuccess("Your message has been sent!");
      setForm({ name: user.username, email: user.email, message: "" });
      fetchMyQueries(); // Refresh queries after sending
    } catch (error) {
      setSuccess("Error sending message. Try again.");
    }

    setLoading(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">
        Support
      </h2>

      {/* Contact Form */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-10">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Mail className="w-6 h-6 text-blue-500" /> Contact Us
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Have a question? Send us a message!
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            rows="4"
            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send />} Send Message
          </button>
          {success && <p className="text-center mt-2 text-green-500">{success}</p>}
        </form>
      </div>

      {/* My Queries Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-blue-500" /> My Queries
        </h3>
        {loadingQueries ? (
          <p className="text-center text-gray-600 dark:text-gray-300 mt-4">Loading queries...</p>
        ) : queries.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-300 mt-4">No queries found.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {queries.map((query) => (
              <li key={query._id} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-700">
                <p><strong>Query:</strong> {query.message}</p>
                {query.responseMessage ? (
                  <p className="text-green-500 mt-2"><strong>Response:</strong> {query.responseMessage}</p>
                ) : (
                  <p className="text-yellow-500 mt-2">Waiting for response...</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SupportPage;
