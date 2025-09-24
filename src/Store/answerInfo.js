import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizId: null,
  duration: 0,
  password: "",
  isLocked: false,
  fullMarks: 0,
  questions: [],
};

const answerSlice = createSlice({
  name: "answer",
  initialState,
  reducers: {
    setData: (state, action) => {
      const obj = action.payload;

      return {
        quizId: obj.id,
        duration: obj.duration,
        password: obj.password,
        isLocked: obj.locked, 
        fullMarks: obj.fullMarks,
        questions: (obj.quizQuestion || []).map((item) => {
          const marks = item.marks || {};
          return {
            qid: item.id,
            question: item.question ?? "",
            options: [
              item.option1 ?? "",
              item.option2 ?? "",
              item.option3 ?? "",
              item.option4 ?? "",
            ],
            type: marks.type ?? "null",
            marks: marks.mark ?? 0,
            negMark: marks.negMark ?? 0,
            answer: item.answer ?? "",
          };
        }),
      };
    },
  },
});

export const { setData } = answerSlice.actions;
export default answerSlice.reducer;
