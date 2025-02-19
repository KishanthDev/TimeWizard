import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Send, Mail, MessageCircle } from "lucide-react";

const SupportPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [queries, setQueries] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchFaqs();
    fetchQueries();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data } = await axios.get("/api/support/faqs");
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const fetchQueries = async () => {
    try {
      const { data } = await axios.get("/api/support/all-queries");
      setQueries(data);
    } catch (error) {
      console.error("Error fetching queries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/support/contact", form);
      setSuccess("Your message has been sent!");
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setSuccess("Error sending message. Try again.");
    }

    setLoading(false);
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">
        Support & FAQ
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
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white"
            required
          />
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

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-10">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-green-500" /> Frequently Asked Questions
        </h3>
        <ul className="mt-4 space-y-4">
          {faqs.map((faq) => (
            <li key={faq._id} className="border-b pb-3">
              <p className="font-semibold text-gray-800 dark:text-white">{faq.question}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Support Queries (For Admins) */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Support Queries</h3>
        <ul className="mt-4 space-y-4">
          {queries.map((query) => (
            <li key={query._id} className="border-b pb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300"><strong>{query.name}</strong> ({query.email})</p>
              <p className="text-gray-600 dark:text-gray-400">{query.message}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SupportPage;