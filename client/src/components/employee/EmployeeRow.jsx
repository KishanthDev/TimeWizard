import ActionButtons from "./ActionButtons";  // Import ActionButtons component

const EmployeeRow = ({ emp, index, onView, onEdit, onDelete }) => {
    return (
        <tr key={emp._id} className="hover:bg-gray-100">
            <td className="border p-2">{index + 1}</td>
            <td className="border p-2">{emp.name}</td>
            <td className="border p-2">{emp.username}</td>
            <td className="border p-2">{emp.email}</td>
            <td className="border p-2">
                <ActionButtons
                    emp={emp}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </td>
        </tr>
    );
};

export default EmployeeRow;
