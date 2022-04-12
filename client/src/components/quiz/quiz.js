import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../src/App.css";

function Quiz() {

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
  const [score, setScore] = useState(0);
  const [questions1, setQuestions] = useState(defaultState);
  const [resultsquiz, setResultQuiz] = useState([]);
  
  useEffect(() => {
    axios.post('/api/quiz/getquizz')
        .then(function (response) {
          let ra = Math.floor(Math.random() * (response.data.lista_quiz.length - 0))+ 0;
          setQuestions(response.data.lista_quiz[ra]);
        })
        .catch(function (error) {
          console.log(error);
        });

  },[])
 
  const optionClicked = (option, idx) => {
    // Incremento de puntuación
    if (option.correcto) {
      setScore(score + 1);
    }
    questions1.questions[currentQuestion].respuestas[idx]['seleccion'] = true;

    if (currentQuestion + 1 < questions1.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setResultQuiz(resultsquiz.concat(questions1.questions[currentQuestion]));

    } else {
      setShowResults(true);
    }


    console.log("=>>>>>>>>>>>>>",resultsquiz);

  };

  const saveGame = () => {
    console.log("sapeeeeeeee", resultsquiz);
  };

  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
    saveGame();
  };

  return (
    <div className="App">
      <h1>Cuestionario</h1>

      <h2>Aciertos: {score}</h2>

      {showResults ? (
        <div className="container">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Resultado</h5>
              <p className="card-text">{score} aciertos de {questions1.questions.length} Correctos - (
              {(score / questions1.questions.length) * 100}%)</p>
              <a href="#" className="btn btn-success" onClick={() => restartGame()}>Jugar de nuevo</a>
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
