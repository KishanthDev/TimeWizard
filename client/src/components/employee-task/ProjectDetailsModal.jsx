import React, { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProject } from "../../slices/projectSlice";
import ChatPopup from "./ChatPopUp";
import { Loader2 } from "lucide-react";

const ProjectDetailsModal = ({ projectId, isOpen, handleProjectModal }) => {
    const { myProject, isLoading } = useSelector((state) => state.projects);
    const dispatch = useDispatch();
    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        if (projectId) {
            dispatch(fetchMyProject(projectId));
        }
    }, [dispatch, projectId]);

    if (!isOpen) return null;

    if (isLoading) 
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-6 h-6 animate-spin text-gray-600 dark:text-gray-300" />
            </div>
        );


    if (!myProject) return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <p className="text-white">No project data available</p>
        </div>
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                {/* Close Button */}
                <button
                    onClick={handleProjectModal}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 hover:dark:text-gray-400"
                >
                    <X size={24} />
                </button>

                {/* Project Info */}
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Project - {myProject?.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Description - {myProject?.description}</p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">
                    Deadline: {new Date(myProject?.deadLine).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-400">Status: {myProject?.status}</p>

                {/* Team Members */}
                <div className="mt-4">
                    <h3 className="text-md font-semibold dark:text-white">Team Members:</h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
                        {myProject.teams.map((member) => (
                            <li key={member._id}>{member.username}</li>
                        ))}
                    </ul>
                </div>

                {/* Attachments */}
                <div className="mt-4">
                    <h3 className="text-md font-semibold dark:text-white">Attachments:</h3>
                    <ul className="list-none text-sm text-blue-600 dark:text-blue-400">
                        {myProject.attachments.map((file) => (
                            <li key={file._id} className="flex justify-between items-center border-b dark:border-gray-600 py-2">
                                <a
                                    href={file.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline dark:text-blue-300"
                                >
                                    View File
                                </a>
                                <a
                                    href={file.filePath}
                                    download
                                    className="text-green-600 dark:text-green-400 hover:underline"
                                >
                                    Download
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Open Chat Button */}
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="mt-4 flex items-center gap-2 bg-blue-500 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-800"
                >
                    <MessageCircle size={20} /> Open Chat
                </button>

                {/* Chat Popup */}
                <ChatPopup projectId={projectId} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            </div>
        </div>
    );
};

export default ProjectDetailsModal;
