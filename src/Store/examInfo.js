import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  xminfo: {
    format: "",
    totalQuestion: 0,
    negativeMark: true,
    mcq1: 0,
    mcq2: 0,
    msq1: 0,
    msq2: 0,
    nat1: 0,
    nat2: 0,
    duration: 0,
    desc: "",
  },
};

const examInfoSlice = createSlice({
  name: "examInfo",
  initialState,
  reducers: {
    loadData: (state, action) => {
      state.xminfo.format = action.payload.format;
      state.xminfo.desc = action.payload.desc;
      state.xminfo.totalQuestion = action.payload.qno;
      state.xminfo.mcq1 = action.payload.mcq1;
      state.xminfo.mcq2 = action.payload.mcq2;
      state.xminfo.msq1 = action.payload.msq1;
      state.xminfo.msq2 = action.payload.msq2;
      state.xminfo.nat1 = action.payload.nat1;
      state.xminfo.nat2 = action.payload.nat2;
      state.xminfo.duration = action.payload.duration;
      state.xminfo.negativeMark = action.payload.neg;
    },
  },
});
export const { loadData } = examInfoSlice.actions;
export default examInfoSlice.reducer
