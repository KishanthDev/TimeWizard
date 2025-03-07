import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { importUsers, clearUsers } from "../../../slices/employeeSlice";

const ImportCSVModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    const importedUsers = useSelector((state) => state.employees?.importedUsers || []);
    const error = useSelector((state) => state.employees?.error || []);
    const status = useSelector((state) => state.employees?.status || "idle");

    const [file, setFile] = useState(null);
    const [fileError, setFileError] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
                setFile(selectedFile);
                setFileError("");
            } else {
                setFile(null);
                setFileError("Only CSV files are allowed.");
            }
        }
    };

    const handleUpload = () => {
        if (file) {
            dispatch(importUsers(file));
        }
    };

    const handleClose = () => {
        dispatch(clearUsers());
        if (isOpen && importedUsers.length === 0) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-white">
                <h2 className="text-lg font-semibold mb-2">Import Users from CSV</h2>

                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="mb-2 border p-2 rounded w-full bg-gray-700 text-white border-gray-600"
                />

                {fileError && <p className="text-red-400 text-sm">{fileError}</p>}

                <button
                    onClick={handleUpload}
                    disabled={!file || status === "loading"}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 mt-2"
                >
                    {status === "loading" ? "Uploading..." : "Upload"}
                </button>

                <h3 className="mt-4 font-semibold">Uploaded Users</h3>
                <ul className="list-disc pl-5">
                    {Array.isArray(importedUsers) && importedUsers.length > 0 ? (
                        importedUsers.map((user, index) => (
                            <li key={index}>{user?.name} - {user?.email}</li>
                        ))
                    ) : (
                        <li className="text-gray-400">No users imported</li>
                    )}
                </ul>

                <h3 className="mt-4 font-semibold">Errors</h3>
                <ul className="text-red-400 list-disc pl-5">
                    {Array.isArray(error) && error.length > 0 ? (
                        error.map((err, index) => <li key={index}>{err}</li>)
                    ) : (
                        <li className="text-gray-400">No errors</li>
                    )}
                </ul>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={handleClose}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImportCSVModal;
