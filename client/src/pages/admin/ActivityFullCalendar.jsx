import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "../../slices/activitySlice";
import { format } from "date-fns";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css"; // Import tooltip styles

const ActivityFullCalendar = () => {
    const dispatch = useDispatch();
    const { activities } = useSelector((state) => state.activities);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        dispatch(fetchActivities({ limit: 20 }));
    }, [dispatch]);

    useEffect(() => {
        if (activities.length > 0) {
            const optimizedData = optimizeActivityData(activities);

            const formattedEvents = optimizedData.map((item) => ({
                title: `${item.user}-${item.task}`,
                date: item.date,
                extendedProps: {
                    details: `Clock In: ${item.clockInCount} | Clock Out: ${item.clockOutCount} | Completed: ${item.completedTaskCount}`,
                },
                backgroundColor: item.completedTaskCount > 0 ? "#4CAF50" : "#FF9800", // Green for completed, orange otherwise
            }));

            setEvents(formattedEvents);
        }
    }, [activities]);

    const optimizeActivityData = (activities) => {
        const groupedData = {};

        activities.forEach(activity => {
            const date = format(new Date(activity.timestamp), "yyyy-MM-dd");
            const key = `${date}-${activity.task}`;

            if (!groupedData[key]) {
                groupedData[key] = {
                    date,
                    task: activity.task,
                    user:activity.user,
                    clockInCount: 0,
                    clockOutCount: 0,
                    completedTaskCount: 0,
                };
            }

            if (activity.action === "clocked in") groupedData[key].clockInCount += 1;
            if (activity.action === "clocked out") groupedData[key].clockOutCount += 1;
            if (activity.action === "completed a task") groupedData[key].completedTaskCount += 1;
        });

        return Object.values(groupedData);
    };

    // Function to handle tooltips
    const handleEventHover = (info) => {
        tippy(info.el, {
            content: info.event.extendedProps.details,
            placement: "top",
            arrow: true,
            animation: "scale",
        });
    };

    return (
        <div className="bg-white  dark:bg-gray-900 dark:text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-3">Employee Activity Calendar</h2>
            <FullCalendar 
                plugins={[dayGridPlugin]} 
                initialView="dayGridMonth" 
                events={events} 
                eventDisplay="block" 
                eventDidMount={handleEventHover} // Attach tooltip
            />
        </div>
    );
};

export default ActivityFullCalendar;
