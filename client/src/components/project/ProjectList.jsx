import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchProjects, deleteProject } from "../../slices/projectSlice";
import { toast } from "react-toastify";
import TeamDisplay from "./TeamDisplay";
import { fetchTasks } from "../../slices/taskSlice";
import EmployeeTasks from "./EmployeeTasks";


const ProjectList = () => {
  const dispatch = useDispatch();
  const { projects, status } = useSelector((state) => state.projects);
  const { tasks } = useSelector(state => state.tasks)
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await dispatch(deleteProject({ id: projectId })).unwrap();
        toast.success("Project deleted successfully");
      } catch (error) {
        toast.error(error);
      }
    }
  };


  const handleViewTasks = (projectId, employee) => {
    setSelectedEmployee(employee);
    setSelectedProjectId(projectId);
    setIsModalOpen(true);
    dispatch(fetchTasks({ projectId, employeeId: employee._id }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="p-4 dark:bg-gray-900 dark:text-gray-300">
      <h2 className="text-lg font-semibold mb-4">Project List</h2>
      {status === "loading" && <p>Loading projects...</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full border dark:bg-gray-900 dark:text-gray-300 bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200  dark:bg-gray-800 dark:text-gray-300">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Budget</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Deadline</th>
              <th className="py-2 px-4">Team</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-t">
                <td className="py-2 px-4">{project.name}</td>
                <td className="py-2 px-4">${project.budget}</td>
                <td className="py-2 px-4">{project.status}</td>
                <td className="py-2 px-4">{project.deadLine && format(new Date(project?.deadLine), "MMMM dd, yyyy")}</td>
                <td className="py-2 px-4">
                  <TeamDisplay
                    team={project.teams}
                    projectId={project._id}
                    onProfileClick={handleViewTasks}
                  />
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
          <EmployeeTasks
            tasks={tasks}
            employee={selectedEmployee}
            projectId={selectedProjectId}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectList;
