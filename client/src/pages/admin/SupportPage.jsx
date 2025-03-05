import { useState, useEffect } from "react";
import axios from "../../config/axios";
import Select from "react-select";

const AdminSupportPanel = () => {
    const [unansweredQueries, setUnansweredQueries] = useState([]);
    const [answeredQueries, setAnsweredQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [savedResponses, setSavedResponses] = useState([
        "We are looking into this issue.",
        "Thank you for reaching out! We will update you soon.",
        "This has been resolved. Please check and confirm."
    ]);

    const [isDarkMode, setIsDarkMode] = useState(
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    // Toggle dark mode manually (optional)
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Fetch all queries
    useEffect(() => {
        fetchQueries();
    }, []);

    const fetchQueries = async () => {
        try {
            const res = await axios.get("/api/support/all-queries");
            setUnansweredQueries(res.data.unansweredQueries);
            setAnsweredQueries(res.data.answeredQueries);
        } catch (error) {
            console.error("Error fetching queries", error);
        }
    };

    // Handle response submission
    const handleResponseSubmit = async () => {
        if (!selectedQuery || !responseMessage) return alert("Enter a response!");

        try {
            await axios.post(`/api/support/respond/${selectedQuery._id}`, { responseMessage });
            alert("Response sent successfully!");
            
            // Save the new response if it's not already in the list
            if (!savedResponses.includes(responseMessage)) {
                setSavedResponses([...savedResponses, responseMessage]);
            }

            setResponseMessage("");
            setSelectedQuery(null);
            fetchQueries(); // Refresh data
        } catch (error) {
            console.error("Error responding to query", error);
        }
    };

    // Custom styles for React Select (light/dark mode)
    const selectStyles = {
        control: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", // Dark: gray-800, Light: white
            borderColor: isDarkMode ? "#374151" : "#d1d5db", // Dark: gray-700, Light: gray-300
            color: isDarkMode ? "#ffffff" : "#000000",
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
        }),
        option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused ? (isDarkMode ? "#374151" : "#f3f4f6") : "transparent",
            color: isDarkMode ? "#ffffff" : "#000000",
        }),
        singleValue: (base) => ({
            ...base,
            color: isDarkMode ? "#ffffff" : "#000000",
        }),
    };

    return (
        <div className={`p-6 min-h-screen ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}`}>
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4">Admin Support Panel</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Unanswered Queries */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Unanswered Queries</h3>
                    <ul className="border dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800">
                        {unansweredQueries.length === 0 && <p className="text-gray-500">No pending queries</p>}
                        {unansweredQueries.map(query => (
                            <li 
                                key={query._id} 
                                className={`p-2 border-b dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 
                                    ${selectedQuery?._id === query._id ? "bg-gray-200 dark:bg-gray-600" : ""}`}
                                onClick={() => setSelectedQuery(query)}
                            >
                                {query.message}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Answered Queries */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Answered Queries</h3>
                    <ul className="border dark:border-gray-700 p-4 rounded bg-white dark:bg-gray-800">
                        {answeredQueries.length === 0 && <p className="text-gray-500">No answered queries</p>}
                        {answeredQueries.map(query => (
                            <li key={query._id} className="p-2 border-b dark:border-gray-700">
                                <p><strong>Query:</strong> {query.message}</p>
                                <p className="text-green-500"><strong>Response:</strong> {query.responseMessage}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Response Box */}
            {selectedQuery && (
                <div className="mt-6 p-4 border dark:border-gray-700 rounded shadow bg-white dark:bg-gray-800">
                    <h3 className="text-lg font-semibold">Respond to Query</h3>
                    <p><strong>From:</strong> {selectedQuery.name} ({selectedQuery.email})</p>
                    <p className="mt-2"><strong>Message:</strong> {selectedQuery.message}</p>

                    {/* React Select with Dark Mode Support */}
                    <Select
                        options={savedResponses.map(response => ({ value: response, label: response }))}
                        onChange={(selected) => setResponseMessage(selected.value)}
                        className="mt-3"
                        placeholder="Select a quick reply..."
                        styles={selectStyles} // Apply dark mode styles
                    />

                    <textarea
                        className="w-full p-2 border dark:border-gray-700 rounded mt-3 bg-gray-100 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your response..."
                        value={responseMessage}
                        onChange={(e) => setResponseMessage(e.target.value)}
                    />

                    <button
                        onClick={handleResponseSubmit}
                        className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Send Response
                    </button>
                </div>
            )}
        </div>
    );
};

export default AdminSupportPanel;
