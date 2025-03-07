const OverdueTasks = ({ tasks }) => {
    const overdueTasks = tasks.filter((task) => task.status === "overdue");
  
    return (
      <div>
        <div className="bg-red-400 p-4 rounded-md mt-4">
          <h3 className="text-lg font-semibold">Overdue Tasks: {overdueTasks.length}</h3>
        </div>
        </div>
    );
  };
  
  export default OverdueTasks