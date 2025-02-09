import React from "react";

const ViewEmployeeModal = ({ isOpen, onClose, employee }) => {
    if (!isOpen || !employee) return null; // Don't render if not open or no data

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 dark:text-gray-300 rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-xl font-bold mb-4">Employee Details</h2>

                <div className="space-y-2">
                    <p><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Username:</strong> {employee.username}</p>
                    <p><strong>Contact:</strong> {employee.contact || "N/A"}</p>
                    <p><strong>Job Title:</strong> {employee.jobTitle || "N/A"}</p>
                </div>

                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewEmployeeModal;
