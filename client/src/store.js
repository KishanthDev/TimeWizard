import { configureStore } from "@reduxjs/toolkit";

import forgotPasswordSlice from "./slices/forgotPasswordSlice.js"
import userSlice from "./slices/userSlice.js"
import taskSlice from "./slices/taskSlice.js"
import projectSlice from "./slices/projectSlice.js"
import employeeSlice from "./slices/employeeSlice.js"

const store = configureStore({
    reducer:{
        user:userSlice,
        forgotPassword:forgotPasswordSlice,
        tasks:taskSlice,
        projects:projectSlice,
        employees:employeeSlice
    }
})

export default store