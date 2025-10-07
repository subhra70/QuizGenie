import { createSlice } from "@reduxjs/toolkit";

const initialState={
    id:-1,
    createTrial:-1,
    autoGenTrial:-1,
    pdate:"",
    duration:0,
    isPremimum:false
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        loadUserData:(state,action)=>{
            state.id=action.payload.user.id;
            state.createTrial=action.payload.createTrial;
            state.autoGenTrial=action.payload.freeTrialAutogen,
            state.pdate=action.payload.purchasedDate,
            state.duration=action.payload.monthDuration,
            state.isPremimum=action.payload.isPremium
        },
        setPayment:(state,action)=>{
            state.createTrial=action.payload.createTrial
            state.autoGenTrial=action.payload.autoGenTrial,
            state.date=action.payload.date,
            state.duration=action.payload.duration
        }
    }
})

export const {loadUserData,setPayment}=userSlice.actions
export default userSlice.reducer