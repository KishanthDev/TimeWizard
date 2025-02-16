import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useSelector } from "react-redux";

const EmployeeTaskCalendar = () => {
  const { allTasks } = useSelector((state) => state.tasks);

  const events = allTasks.map((task) => ({
    title: task.name,
    date: task.dueDate, // Due date of the task
    id: task._id,
  }));

  return (
    <div className="p-4 mt-3 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Project Deadlines
      </h2>
      <div className="dark:bg-gray-900 dark:text-white rounded-lg p-2">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          dayHeaderClassNames="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
          eventClassNames="bg-blue-500 text-white rounded-md px-2 py-1"
        />
      </div>
    </div>
  );
};

export default EmployeeTaskCalendar;
