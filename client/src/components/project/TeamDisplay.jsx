import React from "react";
const TeamDisplay = ({ team, projectId, onProfileClick }) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {team.length > 0 ? (
        team.map((user) => (
          <div
            key={user._id}
            className="relative cursor-pointer"
            onClick={() => onProfileClick(projectId, user)}
          >
            <img
              src={user.profileImage?.filePath || "https://via.placeholder.com/50"}
              alt={user.name}
              className="w-12 h-12 rounded-full border-2 border-gray-300"
            />
          </div>
        ))
      ) : (
        <span className="text-gray-500">No team assigned</span>
      )}
    </div>
  );
};
export default TeamDisplay;
