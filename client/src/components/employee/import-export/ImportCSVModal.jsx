import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { importUsers,clearUsers } from "../../../slices/employeeSlice";

const ImportCSVModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    
    // Ensure default values to prevent map errors
    const users = useSelector((state) => state.users?.users || []);
    const errors = useSelector((state) => state.users?.errors || []);
    const loading = useSelector((state) => state.users?.loading || false);
    const success = useSelector((state) => state.users?.success || false);

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            dispatch(importUsers(file));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold">Import Users from CSV</h2>
                <input type="file" accept=".csv" onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
                {success && <p>Users Imported Successfully!</p>}

                <h3>Uploaded Users</h3>
                <ul>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <li key={index}>{user.name} - {user.email}</li>
                        ))
                    ) : (
                        <li>No users imported</li>
                    )}
                </ul>

                <h3>Errors</h3>
                <ul>
                    {errors.length > 0 ? (
                        errors.map((error, index) => (
                            <li key={index}>{error.error}</li>
                        ))
                    ) : (
                        <li>No errors</li>
                    )}
                </ul>

                <button onClick={() => dispatch(clearUsers())}>Clear</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ImportCSVModal;
