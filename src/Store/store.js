import { configureStore } from "@reduxjs/toolkit";
import examInfoReducer from "./examInfo1"
import questionInfoReducer from "./questionFormat"
import resultResducer from "./resultSet"

const store=configureStore({
    reducer:{
        examinationInfo:examInfoReducer,
        questionInformation:questionInfoReducer,
        resultInfo:resultResducer
    }
})
export default store