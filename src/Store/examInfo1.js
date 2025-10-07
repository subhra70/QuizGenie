import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  xminfo: {
    format: "",
    totalQuestion: 0,
    fullMarks:0,
    negativeMark: true,
    mcq1: 0,
    mcq2: 0,
    msq1: 0,
    msq2: 0,
    nat1: 0,
    nat2: 0,
    duration: 0,
    description: "",
  },
};

const examInfoSlice = createSlice({
  name: "examInfo",
  initialState,
  reducers: {
    loadData: (state, action) => {
      state.xminfo.format = action.payload.format;
      state.xminfo.description = action.payload.description;
      state.xminfo.mcq1 = action.payload.mcq1;
      state.xminfo.mcq2 = action.payload.mcq2;
      state.xminfo.msq1 = action.payload.msq1;
      state.xminfo.msq2 = action.payload.msq2;
      state.xminfo.nat1 = action.payload.nat1;
      state.xminfo.nat2 = action.payload.nat2;
      state.xminfo.duration = action.payload.duration;
      state.xminfo.negativeMark = action.payload.neg;
    },
    setDescription:(state,action)=>{
      state.xminfo.description=action.payload;
    },
    setTotalQuestions:(state,action)=>{
      state.xminfo.totalQuestion=action.payload;
    },
    setFullMarks:(state,action)=>{
      state.xminfo.fullMarks=action.payload;
    }
  },
});
export const { loadData, setDescription,setTotalQuestions,setFullMarks } = examInfoSlice.actions;
export default examInfoSlice.reducer
