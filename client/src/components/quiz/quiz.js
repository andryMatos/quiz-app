import React, { useState, useEffect } from "react";
import { getQuiz } from "../../actions/quizActions";
import axios from "axios";
import "../../../src/App.css";

function Quiz() {
  // Properties
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [questions1, setQuestions] = useState([]);
  const [resultsquiz, setResultQuiz] = useState([]);

  const questions = [
    {
      questions:[
         {
            texto:"¿En qué año inicia la primera Guerra Mundial?",
            respuestas:[
               {
                  "texto":"1920",
                  "correcto":false,
                  "seleccion": false
               },
               {
                  "texto":"1921",
                  "correcto":true,
                  "seleccion": false
               },
               {
                  "texto":"1950",
                  "correcto":false,
                  "seleccion": false
               }
            ]
         },
         {
            texto:"¿En qué año inicia la segunda Guerra Mundial?",
            respuestas:[
               {
                  "texto":"1920",
                  "correcto":false,
                  "seleccion": false
               },
               {
                  "texto":"1921",
                  "correcto":false,
                  "seleccion": false
               },
               {
                  "texto":"1944",
                  "correcto":true,
                  "seleccion": false
               }
            ]
         },
         {
            texto:"¿En qué año invade Alemania a Polonia?",
            respuestas:[
               {
                  "texto":"1920",
                  "correcto":false,
                  "seleccion": false
               },
               {
                  "texto":"1938",
                  "correcto":true,
                  "seleccion": false
               },
               {
                  "texto":"1950",
                  "correcto":false,
                  "seleccion": false
               }
            ]
         }
      ],
      _id:"625358bd3a5d8571a4afaeec",
      name:"Guerras mundiales",
      category:"Historia",
      created_at:"2022-04-10T22:22:53.055Z",
      __v:0
   }

  ];

  useEffect(() => {

    let quest = [] ;
    async function getQuestions(){
      let iddata= {
        id: "625358bd3a5d8571a4afaeec"
      }
      console.log("id =>>>>>>>>>", iddata);
      quest = await axios.post("/api/quiz/getquiz",iddata).then( res => {
        setQuestions(quest );
        console.log("quest=>>>>>>>>>>>>>>>>>>>>>>>>><", quest);
      })
      console.log(questions1);
    }
    getQuestions();

    setQuestions(quest);

    console.log("=>>>>>>>>>>>>>>>",questions1);

  },[])
  // Helper Functions

  /* A possible answer was clicked */
  const optionClicked = (option, idx) => {
    // Incremento de puntuación
    if (option.correcto) {
      setScore(score + 1);
    }
    questions[0].questions[currentQuestion].respuestas[idx]['seleccion'] = true;

    if (currentQuestion + 1 < questions[0].questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setResultQuiz(resultsquiz.concat(questions[0].questions[currentQuestion]));

    } else {
      setShowResults(true);
    }


    console.log("=>>>>>>>>>>>>>",resultsquiz);

  };

  const saveGame = () => {
    console.log("sapeeeeeeee", resultsquiz);
  };

  /* Resets the game back to default */
  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setShowResults(false);
    saveGame();
  };

  return (
    <div className="App">
      {/* 1. Header  */}
      <h1>Cuestionario</h1>

      {/* 2. Current Score  */}
      <h2>Aciertos: {score}</h2>

      {/* 3. Show results or show the question game  */}
      {showResults ? (
        /* 4. Final Results */
        <div className="container">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Resultado</h5>
              <p className="card-text">{score} aciertos de {questions[0].questions.length} Correctos - (
              {(score / questions[0].questions.length) * 100}%)</p>
              <a href="#" className="btn btn-success" onClick={() => restartGame()}>Jugar de nuevo</a>
            </div>
          </div>
        </div>

      ) : (
        /* 5. Question Card  */
        <div className="container">
          <div className="card">
            <h5 className="card-header">Pregunta: {currentQuestion + 1} de {questions[0].questions.length}</h5>
            <div className="card-body">
              {      console.log("Render =======>>>>>>>>",resultsquiz)}
              <h5 className="card-title">{questions[0].name}</h5>
              <h5 className="card-title">{questions[0].questions[currentQuestion].texto}</h5>

              <div className="row">
                {questions[0].questions[currentQuestion].respuestas.map((option, idx) => {
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
