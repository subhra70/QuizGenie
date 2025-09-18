import { configureStore } from "@reduxjs/toolkit";
import examInfoReducer from "./examInfo1"

const store=configureStore({
    reducer:{
        examinationInfo:examInfoReducer
    }
})
export default store