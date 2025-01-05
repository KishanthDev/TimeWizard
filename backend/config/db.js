import mongoose from "mongoose";
const configdb = ()=>{
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("db is connected")
    } catch (er) {
        console.log(er,"Error in db connection")
        process.exit(1);
    }
}
export default configdb