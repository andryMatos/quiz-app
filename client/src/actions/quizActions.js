import axios from "axios";
import { GET_ERRORS } from "./types";

export const getQuiz = (id) => dispatch => {
    axios
    .post("/api/quiz/getquiz", id)
    .then(res => 
        dispatch({
            type: "SUCCESS",
            payload: res
        })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}

export const saveQuiz = (quizData) => dispatch => {
  console.log("quiz data =>>>>>>>>>", quizData);
  axios
    .post("/api/quiz/addquiz", quizData)
    .then(res => dispatch({type: "SUCCESS", payload: res.response.data}))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}
