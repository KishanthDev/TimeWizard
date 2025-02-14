import React, { useState } from "react";
import ProjectForm from "../../components/project/ProjectForm";
import ProjectList from "../../components/project/ProjectList";
import { ToastContainer } from "react-toastify";

const ProjectPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <ToastContainer />
      
      {/* Header with Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          Create Project
        </button>
      </div>

      {/* Project List */}
      <ProjectList />

      {/* Modal for Creating Project */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <ProjectForm handleClose={handleClose} />
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
