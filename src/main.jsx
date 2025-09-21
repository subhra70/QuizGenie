import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Store/store.js";
import Template from "./Template.jsx";
import Home from "./component/homepage/Home.jsx";
import SelectPhase from "./component/createQuiz/SelectPhase.jsx";
import QuizDescCard from "./component/form/QuizDescCard.jsx";
import AutoGenCard from "./component/form/AutoGenCard.jsx";
import PostSelectionCard from "./component/form/PostSelectionCard.jsx";
import ManualCreateQuiz from "./component/createQuiz/ManualCreateQuiz.jsx";
import Err404 from "./component/Err404.jsx";
import History from "./component/history/History.jsx";
import UserProfile from "./component/userAccount/UserProfile.jsx";
import Remaining from "./component/Remaining.jsx";
import Unauthorized401 from "./component/Unauthorized401.jsx";
import Success from "./component/Success.jsx";
import ExamSuccess from "./component/examForm/ExamSuccess.jsx";
import TestForm from "./component/examForm/TestForm.jsx";
import PreseTestForm from "./component/examForm/PreTestForm.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Template />}>
      <Route index element={<Home />} />

      <Route path="selectMethod" element={<SelectPhase />} />
      <Route path="quizDesc" element={<QuizDescCard />} />
      <Route path="autoGen" element={<AutoGenCard />} />
      <Route path="confirmPost" element={<PostSelectionCard />} />
      <Route path="createQuiz" element={<ManualCreateQuiz />} />
      <Route path="resultHistory" element={<History/>}/>
      <Route path="userProfile" element={<UserProfile/>}/>
      <Route path="remaining" element={<Remaining/>}/>
      <Route path="unauthorized" element={<Unauthorized401/>}/>
      <Route path="success" element={<Success/>}/>
      <Route path="xmsuccess" element={<ExamSuccess/>}/>
      <Route path="test" element={<TestForm/>}/>
      <Route path="pretest" element={<PreseTestForm/>}/>
      <Route path="*" element={<Err404/>}/>
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
