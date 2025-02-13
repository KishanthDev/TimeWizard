import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { clockOut } from "../../slices/taskSlice";

const AutoClockOut = ({ taskId }) => {
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  // Set inactivity timeout duration (in milliseconds)
  const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour
  const WARNING_LIMIT = 55 * 60 * 1000; // Show warning at 55 minutes

  // Function to reset the inactivity timer
  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    // Set warning message before clock-out
    warningTimeoutRef.current = setTimeout(() => {
      alert("You have been inactive for 55 minutes. You will be clocked out in 5 minutes if no activity is detected.");
    }, WARNING_LIMIT);

    // Auto clock-out after 1 hour
    timeoutRef.current = setTimeout(() => {
      dispatch(clockOut({ taskId }));
      alert("You were inactive for too long. You have been clocked out.");
    }, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    // Listen for user activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timeoutRef.current);
      clearTimeout(warningTimeoutRef.current);
    };
  }, []);

  return null; // This component only runs in the background
};

export default AutoClockOut;
