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
        role: item.role,
        obtainedMarks: item.obtainedMark,
        fullMarks: item.quizClass.fullMarks,
        date: item.date,
        locked: item.quizClass.locked,
        isPerformed: item.performed,
      }));
    },
    handleLock: (state, action) => {
      const item = state.find((item) => item.quizId === action.payload);
      if (item) {
        item.locked = !item.locked;
      }
    },
    handlePerformed: (state, action) => {
      state.forEach((item) => {
        if (item.resId === action.payload) {
          item.isPerformed = true;
        }
      });
    },
    handleDelete: (state, action) => {
      return state.filter((item) => item.resId !== action.payload);
    },
    addQuiz: (state, action) => {
      const exists = state.some(item => item.quizId === action.payload.quizClass.id);
      if (!exists) {
        const item = action.payload;
        state.unshift({
          resId: item.id,
          quizId: item.quizClass.id,
          role: item.role,
          obtainedMarks: item.obtainedMark,
          fullMarks: item.quizClass.fullMarks,
          date: item.date,
          locked: item.quizClass.locked,
          isPerformed: item.performed,
        });
      }
    },
  },
});

export const { loadData, handleLock, handlePerformed, handleDelete, addQuiz } =
  resultSlice.actions;
export default resultSlice.reducer;
