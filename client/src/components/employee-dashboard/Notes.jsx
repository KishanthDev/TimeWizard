import React, { useState, useEffect } from "react";

const Notes = () => {
  const [note, setNote] = useState("");

  // Load the saved note from localStorage on mount
  useEffect(() => {
    const savedNote = localStorage.getItem("employeeNote");
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  // Save the note to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("employeeNote", note);
  }, [note]);

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-lg w-full h-full">
      <h2 className="text-xl font-bold mb-2">Your Notes</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full h-full dark:bg-gray-800 p-3 border rounded-lg focus:outline-none resize-none"
      />
    </div>
  );
};

export default Notes;
