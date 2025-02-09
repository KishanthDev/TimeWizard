import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import EmployeeList from "../../components/employee/EmployeeList";
import { Upload, FilePlus, Download, ChevronDown } from "lucide-react";
import EmployeeModal from "../../components/employee/import-export/EmployeeModal";
import ImportCSVModal from "../../components/employee/import-export/ImportCSVModal"; // Import CSV Modal
import { addEmployee, editEmployee, setEditEmp } from "../../slices/employeeSlice";
import { useDispatch, useSelector } from "react-redux";
import { exportToCSV, exportToExcel } from "../../components/employee/import-export/Export";


const EmployeesPage = () => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const { employees, selectedEmployee } = useSelector(state => state.employees)
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false); // Add Employee Modal
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false); // CSV Import Modal

    const handleDropdownToggle = (dropdown) => {
        setOpenDropdown((prev) => (prev === dropdown ? null : dropdown));
    };

    const handleAddEmployeeClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        dispatch(setEditEmp(null))
    };

    const handleUploadCSVClick = () => {
        setIsCSVModalOpen(true); // Open CSV Modal
    };

    const handleCloseCSVModal = () => {
        setIsCSVModalOpen(false); // Close CSV Modal
    };

    const handleSubmitEmployee = async (employeeData) => {
        try {
            if (selectedEmployee) {
                await dispatch(editEmployee({ id: selectedEmployee._id,formData:employeeData })).unwrap()
                toast.success("Employee updated successfully");
            } else {
                await dispatch(addEmployee(employeeData)).unwrap();
                toast.success("Employee created successfully");
            }
        } catch (error) {
            console.log(error.errors.map(ele => ele.msg));
            throw error;
        }
    };

    return (
        <div className="p-4">
            <ToastContainer />

            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Employees</h1>

                <div className="flex gap-3 relative">
                    {/* Import Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => handleDropdownToggle("import")}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg  dark:bg-gray-700 dark:text-gray-300 bg-white shadow hover:bg-gray-100"
                        >
                            <Upload className="w-4 h-4" />
                            Import
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {openDropdown === "import" && (
                            <div className="absolute left-0 mt-2 w-37  dark:bg-gray-700 dark:text-gray-300 bg-white border shadow-lg rounded-lg z-10">
                                <button
                                    className="w-full flex items-center px-2 py-2 dark:hover:bg-gray-600 hover:bg-gray-100"
                                    onClick={() => {
                                        handleAddEmployeeClick();
                                        handleDropdownToggle("import");
                                    }}
                                >
                                    <FilePlus className="w-4 h-4 mr-0.5" />
                                    <span className="text-sm">Add Employee</span>
                                </button>
                                <button
                                    className="w-full flex items-center px-2 py-2 dark:hover:bg-gray-600 hover:bg-gray-100"
                                    onClick={() => {
                                        handleUploadCSVClick();
                                        handleDropdownToggle("import");
                                    }}
                                >
                                    <Upload className="w-4 h-4 mr-0.5" />
                                    <span className="text-sm">Upload CSV</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Export Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { handleDropdownToggle("export") }}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg  dark:bg-gray-700 dark:text-gray-300 bg-white shadow hover:bg-gray-100"
                        >
                            <Download className="w-4 h-4" />
                            Export
                            <ChevronDown className="w-4 h-4" />
                        </button>

                        {openDropdown === "export" && (
                            <div className="absolute left-0 mt-2 w-37  dark:bg-gray-700 dark:text-gray-300 bg-white border shadow-lg rounded-lg z-10">
                                <button
                                    className="w-full flex items-center px-2 py-2 dark:hover:bg-gray-600 hover:bg-gray-100"
                                    onClick={() => exportToCSV(employees)}
                                >
                                    <Download className="w-4 h-4 mr-0.5" />
                                    <span className="text-sm">Export as CSV</span>
                                </button>
                                <button
                                    className="w-full flex items-center px-2 py-2 dark:hover:bg-gray-600 hover:bg-gray-100"
                                    onClick={() => exportToExcel(employees)}
                                >
                                    <Download className="w-4 h-4 mr-0.5" />
                                    <span className="text-sm">Export as Excel</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EmployeeList />

            {/* Add Employee Modal */}
            <EmployeeModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleSubmitEmployee} />

            {/* Import CSV Modal */}
            <ImportCSVModal isOpen={isCSVModalOpen} onClose={handleCloseCSVModal} />
        </div>
    );
};

export default EmployeesPage;
