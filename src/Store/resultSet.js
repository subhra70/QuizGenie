import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const resultSlice = createSlice({
  name: "result",
  initialState,
  reducers: {
    loadData: (state, action) => {
      return action.payload.map((item) => ({
        resId: item.id,
        quizId: item.quizClass.id,
        obtainedMarks: item.obtainedMark,
        fullMarks: item.quizClass.fullMarks,
        date: item.date,
        locked: item.quizClass.isLocked,
        performed: item.quizClass.isPerformed,
      }));
    },
    handleLock: (state, action) => {
      state.forEach((item) => {
        if (item.resId === action.payload) {
          item.locked = !item.locked;
        }
      });
    },
    handlePerformed: (state, action) => {
      state.forEach((item) => {
        if (item.resId === action.payload) {
          item.performed = true;
        }
      });
    },
    handleDelete: (state, action) => {
      return state.filter((item) => item.resId !== action.payload);
    },
  },
});

export const { loadData, handleLock, handlePerformed, handleDelete } =
  resultSlice.actions;
export default resultSlice.reducer;
