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

module.exports = router;

