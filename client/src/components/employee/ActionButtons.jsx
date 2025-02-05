const ActionButtons = ({ emp, onView, onEdit, onDelete }) => (
    <div className="flex items-center justify-center space-x-2">
        <button
            onClick={() => onView(emp._id)}
            className="p-1 border rounded-lg hover:text-blue-900 hover:bg-blue-300 text-xs space-x-1"
            title="View"
        >
            👁️
        </button>
        <button
            onClick={() => onEdit(emp)}
            className="p-1 border rounded-lg hover:text-yellow-700 hover:bg-yellow-300 text-xs space-x-1"
            title="Edit"
        >
            ✏️
        </button>
        <button
            onClick={() => onDelete(emp._id)}
            className="p-1 border rounded-lg hover:text-red-700 hover:bg-red-300 text-xs space-x-1"
            title="Delete"
        >
            🗑️
        </button>
    </div>
);

export default ActionButtons;
