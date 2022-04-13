const express = require("express");
const router = express.Router();

// Csrgamos nuestras validaciones
const validateQuizInput = require("../../validation/quiz");

// Cargamos nuestro modelo
const Quiz = require("../../models/Quiz");

// Rutas para el Modelo Quiz
router.post("/addquiz",(req, res) =>{

    const { errors, isValid } = validateQuizInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    Quiz.findOne({ name: req.body.name }).then(quiz => {
        if(quiz){
            return res.status(400).json({name: "This Quiz is Already exist"});
        }else{
            const newQuiz = new Quiz({
                name: req.body.name,
                questions: req.body.questions,
                category: req.body.category
            });

            newQuiz
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        }
    });

});

router.post("/getquiz",(req,res) =>{

    Quiz.findById({_id: req.body.id}, function(err, result) {
        if (err) {
            res.send(err);
          } else {
            res.json(result);
          }
    })

})

router.post("/getquizz",(req, res) => {
    Quiz.find((err, lista_quiz) => {
        if (err) {
            res.json({
                resultado: false,
                msj: 'No se encontraron registros',
                err
            });
        } else {
            res.json({
                resultado: true,
                msj: 'Registros encontrados',
                lista_quiz
            });
        }
    });
})

router.post("/addAnswer",(req, res) => {
    Quiz.findByIdAndUpdate(req.body.id,
        {
            $push: {
                questions : [{
                    texto: req.body.texto,
                    respuestas: req.body.respuestas
                }]
            }
        },
        {new: true},
        function(err, quiz){
            if(err){
                return res.status(500).send({
                    message: err.message || "Some error has ocurred"
                });
            }
            if(!quiz){
                return res.status(404).send({
                    message: "Quiz Not found"
                });
            }
            return res.status(200).send(quiz);
        })
})

router.post("/deletequiz",(req, res) => {
    Quiz.findByIdAndDelete(req.body.id,
        function(err, quiz){
            if(err){
                return res.status(500).send({
                   message: err.message || "Some error has ocurred" 
                });
            }
            if(!quiz){
                return res.status(404).send({
                    message: "Quiz Not Found"
                });
            }
            return res.status(200).send(quiz);
        })
})

module.exports = router;

