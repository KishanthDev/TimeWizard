import dotenv from "dotenv"
dotenv.config()
import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import configdb from "./config/db.js"
import userRoutes from "./routers/user-routes.js"
import projectRoutes from "./routers/project-routes.js"
import taskRoutes from "./routers/task-routes.js"
import activityRoutes from "./routers/activity-routes.js"
import chatRoutes from "./routers/chat-routers.js"
import chatHandler from "./controllers/chat-handler.js"
import loggerMiddleware from "./middleware/loggerMiddleware.js"
import generalChatHandler from "./controllers/generalChat-handler.js"
import paymentRoutes from "./routers/payment-routes.js"
import paymentController from "./controllers/payment-controller.js"

const app = express()
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

const PORT = process.env.PORT
configdb()
app.use("/api/payments/webhooks",express.raw({ type: "application/json" }))
app.use(express.json());
app.use(loggerMiddleware)

global.io = io

app.use(cors())


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    chatHandler(io, socket);
    generalChatHandler(io,socket)
  });

app.use("/api/users",userRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/activities",activityRoutes)
app.use("/api/messages",chatRoutes)
app.use("/api/payments",paymentRoutes)

server.listen(PORT,()=>{
    console.log("server is running on port" ,PORT); 
})