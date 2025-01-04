import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import configdb from "./config/db.js"
import userRoutes from "./routers/user-routes.js"
const app = express()
dotenv.config()

const PORT = process.env.PORT
configdb()
app.use(express.json())
app.use(cors())

app.use("/api/users",userRoutes)

app.listen(PORT,()=>{
    console.log("server is running on port" ,PORT); 
})