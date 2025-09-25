import { createSlice } from "@reduxjs/toolkit";

const initialState={
    id:-1,
    createTrial:-1,
    autoGenTrial:-1,
    date:"",
    duration:0
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        setPayment:(state,action)=>{
            state.createTrial=action.payload.createTrial
            state.autoGenTrial=action.payload.autoGenTrial,
            state.date=action.payload.date,
            state.duration=action.payload.duration
        }
    }
})

export const {setPayment}=userSlice.actions
export default userSlice.reducer