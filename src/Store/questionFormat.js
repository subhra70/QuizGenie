import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const questionSlice = createSlice({
  name: "questionInfo",
  initialState,
  reducers: {
    loadData: (state, action) => {
      const obj=action.payload
      const questions=obj.quizQuestion
      return questions.map((item) => {
        const marks=item.marks||{}
        console.log(marks);
        
        return {
          qid: item.id,
          question:item.question ?? "",
          options: [
            item.option1 ?? "",
            item.option2 ?? "",
            item.option3 ?? "",
            item.option4 ?? "",
          ],
          type: marks.type || "null",
          marks: marks.mark,
          negMark: marks.negMark,
          answer: "",
        };
      });
    },
    performAnswer: (state, action) => {
      const { index, answer } = action.payload;
      if (state[index]) {
        state[index].answer = answer;
      }
    },
  },
});

export const { loadData, performAnswer } = questionSlice.actions;
export default questionSlice.reducer;
