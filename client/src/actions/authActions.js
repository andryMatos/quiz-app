import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";

// Registrar usuarios
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login y obtención del Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Guardamos en el LocalStorage

      // Seteamos el Token en el LocalStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Seteamos el token en la cabecera de las peticiones
      setAuthToken(token);
      // Decodificamos el token para saber el usuario
      const decoded = jwt_decode(token);
      // Obtenemos el usuario en el token
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Setear a un usuario logueado
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Carga de usuario
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Cerrar sesión
export const logoutUser = () => dispatch => {
  // Eliminamos el token del LocalStorage
  localStorage.removeItem("jwtToken");
  // Removemos el cabecero el Token
  setAuthToken(false);
  // Reiniciamos los valores de currentUser
  dispatch(setCurrentUser({}));
};
