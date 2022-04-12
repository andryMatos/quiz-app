import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Dashboard from "./components/dashboard/Dashboard";
import Quiz from "./components/quiz/quiz";
import Catalog from "./components/quizcat/index";

import "./App.css";

// Verificamos si tiene algún token para mantener la sesión activa
if (localStorage.jwtToken) {
  // Seteamos el token en cabecera para las peticiones
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decodificamos el token para obtener nombre de usuario y fecha de expiración del Token
  const decoded = jwt_decode(token);
  // Seteamos el valor de autenticación de usuario
  store.dispatch(setCurrentUser(decoded));
  // Validamos que el token tenga una validez valida
  const currentTime = Date.now() / 1000; // milisegundos
  if (decoded.exp < currentTime) {
    // Si ya expiro el token, haremos el logout
    store.dispatch(logoutUser());

    // Redireccionamos al login
    window.location.href = "./login";
  }
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/quiz" component={Quiz}/>
              <PrivateRoute exact path="/Catalog" component={Catalog}/>
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
