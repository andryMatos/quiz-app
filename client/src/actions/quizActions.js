import axios from "axios";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

export const getQuiz = (id) => dispatch => {
    axios
    .post("/api/quiz/getquiz", id)
    .then(res => 
        dispatch({
            type: "SUCESS",
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
