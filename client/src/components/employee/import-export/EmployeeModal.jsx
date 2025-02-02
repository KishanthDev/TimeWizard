import { useState } from "react";
import validator from "validator";
import "./EmployeeModal.css"; // Include your CSS file for animations

const form = {
    name: "",
    username: "",
    email: "",
    password: "",
}

const EmployeeModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState(form);

    const [errors, setErrors] = useState({}); // To store error messages

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        let formErrors = {};
        // Check if fields are empty
        if (!formData.name) formErrors.name = "Name is required.";
        if (!formData.username) formErrors.username = "Username is required.";
        if (!formData.email) formErrors.email = "Email is required.";
        if (!formData.password) formErrors.password = "Password is required.";

        // Validate username and name length
        if (formData.username && formData.username.length < 5) {
            formErrors.username = "Username must be at least 5 characters long.";
        }
        if (formData.name && formData.name.length < 5) {
            formErrors.name = "Name must be at least 5 characters long.";
        }

        // Validate email format
        if (formData.email && !validator.isEmail(formData.email)) {
            formErrors.email = "Please enter a valid email address.";
        }

        // Validate password strength
        if (formData.password && !validator.isStrongPassword(formData.password, { minLength: 8, minSymbols: 1 })) {
            formErrors.password = "Password must be at least 8 characters long and contain at least one symbol.";
        }

        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formErrors = validate(); // Validate client-side
    
        if (Object.keys(formErrors).length === 0) {
            try {
                await onSubmit(formData);
                onClose();
                setFormData(form)
            } catch (serverError) {
                if (serverError.errors) {
                    const serverFormErrors = {};
                    serverError.errors.forEach((err) => {
                        if (err.path.includes("email")) {
                            serverFormErrors.email = err.msg;
                        }
                        if (err.path.includes("username")) {
                            serverFormErrors.username = err.msg;
                        }
                    });
                    setErrors((prevErrors) => ({ ...prevErrors, ...serverFormErrors }));
                } else {
                    // Fallback if the error is not related to email or username
                    console.log("Server Error:", serverError);
                }
            }
        } else {
            setErrors(formErrors); // Display client-side validation errors
        }
    };
    

    return (
        isOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center animate-fadeIn">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96 transform transition-all animate-slideIn">
                    <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
                            >
                                Add Employee
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default EmployeeModal;
