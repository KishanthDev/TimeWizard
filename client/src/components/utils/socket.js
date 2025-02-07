import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3092"; // Replace with your server URL in production

const socket = io(SOCKET_URL, {
  autoConnect: false, // Connect only when needed
});

export default socket;
