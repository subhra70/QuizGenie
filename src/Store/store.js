import { configureStore } from "@reduxjs/toolkit";
import examInfoReducer from "./examInfo1"
import questionInfoReducer from "./questionFormat"
import resultResducer from "./resultSet"
import answerReducer from "./answerInfo"
import userReducer from "./userInfo"

const store=configureStore({
    reducer:{
        examinationInfo:examInfoReducer,
        questionInformation:questionInfoReducer,
        resultInfo:resultResducer,
        answerInfo:answerReducer,
        userInfo:userReducer
    }
})
export default store