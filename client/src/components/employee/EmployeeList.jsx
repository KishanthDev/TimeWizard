import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLimit, toggleSortOrder, fetchEmployees } from "../../slices/employeeSlice";
import SearchBar from "./SearchBar";
import Pagination from "./Pagination";
import EmployeeRow from "./EmployeeRow";
import ViewEmployeeModal from "./ViewEmployeeModal";

const EmployeeList = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const { employees, status, currentPage, totalPages, sortBy, order, limit } = useSelector(
        (state) => state.employees
    );

    useEffect(() => {
        dispatch(fetchEmployees({ sortBy, order, page: currentPage, limit }));
    }, [dispatch, sortBy, order, currentPage, limit]);

    const handleSort = (column) => { dispatch(toggleSortOrder(column)) };
    const handleLimitChange = (e) => { dispatch(setLimit(Number(e.target.value))); };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    const renderArrow = (column) => {
        return (
            <span className={`ml-1 ${sortBy === column ? "font-bold text-black" : "text-gray-500"}`}>
                {order === "asc" ? "↑" : "↓"}
            </span>
        );
    };

    const handleView = (id) => {
        const employee = employees.find(emp => emp._id === id);
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleEdit = (id) => {
        console.log(`Editing employee ${id}`);
    };

    const handleDelete = (id) => {
        console.log(`Deleting employee ${id}`);
    };

    if (status === "loading") return <p className="text-center mt-4">Loading...</p>;
    if (status === "failed") return <p className="text-red-500 text-center mt-4">Failed to load employees.</p>;

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
                        {employees.length > 0 ? (
                            employees.map((emp, i) => (
                                <EmployeeRow
                                    key={emp._id}
                                    emp={emp}
                                    index={i}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
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
