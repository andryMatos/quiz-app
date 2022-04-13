import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../src/App.css";


function Quiz(Auth) {
  const defaultState = {
    questions:[{
      texto: "",
      respuestas:[{

      }]
    }],
    _id:"",
    name: "",
    category:"",
    created_at: "",
    __v:0
  };
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [puntuacion, setScore] = useState(0);
  const [questions1, setQuestions] = useState(defaultState);
  const [resultsquiz, setResultQuiz] = useState([]);
  const [userID, setUserID] = useState(Auth.user.id);

  useEffect(() => {

    axios.post('/api/quiz/getquizz')
        .then(function (response) {
          if(response.data.lista_quiz.length > 0){
            let ra = Math.floor(Math.random() * (response.data.lista_quiz.length - 0))+ 0;
            setQuestions(response.data.lista_quiz[ra]);
          }else{

          }
          
        })
        .catch(function (error) {
          console.log(error);
        });

  },[])
 
  const optionClicked = (option, idx) => {
    // Incremento de puntuación
    if (option.correcto) {
      setScore(puntuacion + 1);
    }
    questions1.questions[currentQuestion].respuestas[idx]['seleccion'] = true;

    if (currentQuestion + 1 < questions1.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setResultQuiz(resultsquiz.concat(questions1.questions[currentQuestion]));

    } else {
      setResultQuiz(resultsquiz.concat(questions1.questions[currentQuestion]));
      setShowResults(true);
    }

  };

  const saveGame = () => {
    let data = {
      id:userID,
      game:questions1.name,
      score:puntuacion,
      name: questions1.name,
      questions:resultsquiz
    }
    console.log("data =>>>>>>>>>>", data);
    axios.post('/api/users/addquiz', data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
    saveGame();
    setResultQuiz([]);
  };

  return (
    <div className="App">
      <h1>Cuestionario</h1>

      <h2>Aciertos: {puntuacion}</h2>

      {showResults ? (
        <div className="container">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Resultado</h5>
              <p className="card-text">{puntuacion} aciertos de {questions1.questions.length} Correctos - (
              {(puntuacion / questions1.questions.length) * 100}%)</p>
              <a href="#" className="btn btn-success" onClick={() => restartGame()}>Jugar de nuevo</a>
            </div>
            <div>                
                  {resultsquiz.map((res, idx) => (
                    <div key={idx}>
                      <div >Pregunta: {res.texto}</div>
                      <ul className="list-group">
                        {res.respuestas.map((r, index) => (
                          r.correcto && r.seleccion ?
                          <li className="list-group-item list-group-item-success" key={index}>Correcto: {r.texto}</li>
                          : r.seleccion ? 
                          <li className="list-group-item list-group-item-warning" key={index}>Tu selección :( :{r.texto}</li>
                          :
                          <li className="list-group-item" key={index}>{r.texto}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  
            </div>
          </div>
        </div>

      ) : (
        <div className="container">
          <div className="card">
            <h5 className="card-header">Nombre: { questions1.name }</h5>
            <h5 className="card-header">Pregunta: {currentQuestion + 1} de {questions1.questions.length}</h5>
            <div className="card-body">
              <h5 className="card-title">{questions1.questions[currentQuestion].texto}</h5>

              <div className="row">
                {questions1.questions[currentQuestion].respuestas.map((option, idx) => {
                  return (
                    <div className="col-md-12" style={{marginTop: '10px'}} key={idx}>
                      <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => optionClicked(option, idx)}>{option.texto} </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Quiz;
