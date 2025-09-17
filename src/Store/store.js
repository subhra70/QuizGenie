import { configureStore } from "@reduxjs/toolkit";
import examInfoReducer from "./examInfo"

const store=configureStore({
    reducer:{
        examinationInfo:examInfoReducer
    }
})
export default store