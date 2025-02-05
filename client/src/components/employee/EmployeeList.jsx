import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLimit, fetchEmployees,deleteEmployee, setEditEmp } from "../../slices/employeeSlice";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import EmployeeRow from "./EmployeeRow";
import ViewEmployeeModal from "./View-EmployeeDetails";
import { toast } from "react-toastify";

const EmployeeList = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [localSortBy, setLocalSortBy] = useState("name");
    const [localOrder, setLocalOrder] = useState("asc");
    
    const { employees, status, currentPage, totalPages, limit } = useSelector(
        (state) => state.employees
    );

    // Fetch employees only on mount, pagination, or limit change
    useEffect(() => {
        dispatch(fetchEmployees({ page: currentPage, limit }));
    }, [dispatch, currentPage, limit]);

    // Local sorting to prevent flicker
    const sortedEmployees = useMemo(() => {
        return [...employees].sort((a, b) => {
            if (localOrder === "asc") return a[localSortBy]?.localeCompare(b[localSortBy]);
            return b[localSortBy]?.localeCompare(a[localSortBy]);
        });
    }, [employees, localSortBy, localOrder]);

    const handleSort = (column) => {
        if (localSortBy === column) {
            setLocalOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setLocalSortBy(column);
            setLocalOrder("asc");
        }
    };

    const handleLimitChange = (e) => {
        dispatch(setLimit(Number(e.target.value)));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    const renderArrow = (column) => (
        <span className={`ml-1 ${localSortBy === column ? "font-bold text-black" : "text-gray-500"}`}>
            {localOrder === "asc" ? "↑" : "↓"}
        </span>
    );

    const handleEdit = (id) =>{dispatch(setEditEmp(id))}

    const handleView = (id) => {
        const employee = employees.find((emp) => emp._id === id);
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                await dispatch(deleteEmployee(id)).unwrap();
                toast.success("Employee deleted successfully!");
            } catch (error) {
                toast.error("Error deleting employee. Please try again.");
            }
        }
    };
    
    if (status === "loading") {
        return <p className="text-center mt-4">Loading...</p>;
    }

    if (status === "failed") {
        return <p className="text-red-500 text-center mt-4">Failed to load employees.</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
            
            <div className="flex justify-between items-center mb-4">
                <div>
                    <label className="mr-2">Show</label>
                    <select value={limit} onChange={handleLimitChange} className="border p-2 rounded">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                    </select>
                    <span className="ml-2">entries</span>
                </div>
                <SearchBar limit={limit} />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-2 cursor-pointer">#</th>
                            <th className="border p-2 cursor-pointer" onClick={() => handleSort("name")}>
                                Name {renderArrow("name")}
                            </th>
                            <th className="border p-2 cursor-pointer" onClick={() => handleSort("username")}>
                                Username {renderArrow("username")}
                            </th>
                            <th className="border p-2 cursor-pointer" onClick={() => handleSort("email")}>
                                Email {renderArrow("email")}
                            </th>
                            <th className="border p-2 cursor-pointer">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedEmployees.length > 0 ? (
                            sortedEmployees.map((emp, i) => (
                                <EmployeeRow
                                    key={emp._id}
                                    emp={emp}
                                    index={i}
                                    onView={handleView}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4">No employees found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} limit={limit} />
            <ViewEmployeeModal isOpen={isModalOpen} onClose={handleCloseModal} employee={selectedEmployee} />
        </div>
    );
};

export default EmployeeList;
