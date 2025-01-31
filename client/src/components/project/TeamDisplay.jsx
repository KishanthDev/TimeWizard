import React from "react";

const TeamDisplay = ({ team, projectId, onProfileClick }) => {
  return (
    <div className="flex items-center space-x-4">
      {team.length > 0 ? (
        team.map((user) => (
          <div
            key={user._id}
            className="relative"
            onClick={() => onProfileClick(projectId, user)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={user.profileImage?.filePath || "https://via.placeholder.com/50"}
              alt={user.name}
              className="w-12 h-12 rounded-full border-2 border-gray-300"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
        ))
      ) : (
        <span className="text-gray-500">No team assigned</span>
      )}
    </div>
  );
};

export default TeamDisplay;
