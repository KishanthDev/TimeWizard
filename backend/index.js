import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import configdb from "./config/db.js"
import userRoutes from "./routers/user-routes.js"
import projectRoutes from "./routers/project-routes.js"
import taskRoutes from "./routers/task-routes.js"
import activityRoutes from "./routers/activity-routes.js"

const app = express()


const PORT = process.env.PORT
configdb()
app.use(express.json());


app.use(cors())

app.use("/api/users",userRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/tasks",taskRoutes)
app.use("/api/activities",activityRoutes)

app.listen(PORT,()=>{
    console.log("server is running on port" ,PORT); 
})