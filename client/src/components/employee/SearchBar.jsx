import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearch, fetchEmployees } from "../../slices/employeeSlice";
import axios from "../../config/axios";
import { toast } from "react-toastify"; // Import toast

const SearchBar = ({ limit }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [noResults, setNoResults] = useState(false); // Track no record found
    const dispatch = useDispatch();

    useEffect(() => {
        if (searchTerm.length > 1) {
            const fetchSuggestions = async () => {
                try {
                    const { data } = await axios.get("/api/users/get", {
                        params: { search: searchTerm, page: 1, limit },
                        headers: { Authorization: localStorage.getItem("token") },
                    });

                    if (data.users.length === 0) {
                        setNoResults(true);
                        setSuggestions([]);
                    } else {
                        setNoResults(false);
                        setSuggestions(data.users);
                    }
                } catch (error) {
                    toast.error("Failed to fetch data. Please try again.");
                    setSuggestions([]);
                    setNoResults(true);
                }
            };

            const debounce = setTimeout(fetchSuggestions, 300);
            return () => clearTimeout(debounce);
        } else {
            setSuggestions([]);
            setNoResults(false);
        }
    }, [searchTerm, limit]);

    const handleSelect = (employee) => {
        setSearchTerm(employee.name);
        setSuggestions([]);
        setNoResults(false);
        dispatch(setSearch(employee.name));
        dispatch(fetchEmployees({ search: employee.name, page: 1, limit }));
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (noResults) {
            toast.error("No records found for this search!"); // Show error toast
            return; // Stop API call if no results exist
        }

        dispatch(setSearch(searchTerm));
        dispatch(fetchEmployees({ search: searchTerm, page: 1, limit }));
    };

    const handleReset = () => {
        setSearchTerm("");
        setSuggestions([]);
        setNoResults(false);
        dispatch(setSearch(""));
        dispatch(fetchEmployees({ search: "", page: 1, limit }));
    };

    return (
        <div className="relative w-full max-w-md">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border dark:bg-gray-700 dark:text-gray-300 border-gray-300 rounded w-full"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>
                <button type="button" onClick={handleReset} className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none">Back</button>
            </form>

            {/* Search Suggestions Dropdown */}
            {searchTerm.length > 1 && (
                <ul className="absolute w-full bg-white border  dark:bg-gray-700 dark:text-gray-300 border-gray-300 rounded mt-1 shadow-lg max-h-40 overflow-auto">
                    {noResults ? (
                        <li className="p-2 dark:text-gray-300 text-gray-500 text-center">No records found</li>
                    ) : (
                        suggestions.map((emp) => (
                            <li
                                key={emp._id}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                                onClick={() => handleSelect(emp)}
                            >
                                <span className="font-medium">{emp.name}</span>
                                <span className="text-gray-500 text-sm">{emp.username} | {emp.email}</span>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
