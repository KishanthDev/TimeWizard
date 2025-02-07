import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProject } from "../../slices/projectSlice";

const ProjectDetailsModal = ({ projectId, isOpen, handleProjectModal }) => {
    console.log(projectId);
    
    const {myProject,isLoading} = useSelector(state=>state.projects)
    const dispatch = useDispatch()
    useEffect(() => {
        console.log("Fetching project with ID:", projectId);
        if (projectId) {
          dispatch(fetchMyProject(projectId));
        }
      }, [dispatch, projectId]);
      if (!isOpen) return null; // Don't render when modal is closed

      if (isLoading) return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><p>Loading...</p></div>;
  
      // Ensure `myProject` is not null or undefined before rendering details
      if (!myProject) return <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><p>No project data available</p></div>;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
        {/* Close Button */}
        <button
          onClick={handleProjectModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* Project Details */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Project - {myProject.name}</h2>
        <p className="text-sm text-gray-600 mb-2">Description - {myProject.description}</p>
        <p className="text-sm font-medium text-gray-700">Budget: ${myProject.budget}</p>
        <p className="text-sm font-medium text-gray-700">Deadline: {new Date(myProject.deadLine).toLocaleDateString()}</p>
        <p className="text-sm font-medium text-gray-700">Status: {myProject.status}</p>

        {/* Team Members */}
        <div className="mt-4">
          <h3 className="text-md font-semibold">Team Members:</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {myProject.teams.map((member) => (
              <li key={member._id}>{member.username}</li>
            ))}
          </ul>
        </div>

        {/* Attachments */}
        <div className="mt-4">
          <h3 className="text-md font-semibold">Attachments:</h3>
          <ul className="list-none text-sm text-blue-600">
            {myProject.attachments.map((file) => (
              <li key={file._id} className="flex justify-between items-center border-b py-2">
                <a
                  href={file.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  View File
                </a>
                <a
                  href={file.filePath}
                  download
                  className="text-green-600 hover:underline"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
