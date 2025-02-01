import { useDispatch } from "react-redux";
import { fetchEmployees } from "../../slices/employeeSlice";

const Pagination = ({ currentPage, totalPages, limit }) => {
    const dispatch = useDispatch();

    const changePage = (newPage) => {
        dispatch(fetchEmployees({ search: "", sortBy: "name", order: "asc", page: newPage, limit }));
    };

    return (
        <div className="flex justify-center mt-4 space-x-2">
            <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
                Prev
            </button>
            <span className="px-4 py-2">{currentPage} / {totalPages}</span>
            <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
