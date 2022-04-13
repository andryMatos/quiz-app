const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Cargamos nuestras validaciones
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Cargamos nuestros modelos
const User = require("../../models/User");

//Rutas de login y registro son de acceso publico
router.post("/register", (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  // Si existe algún error lo devolveremos a la vista
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hasheamos la contraseña antes de guardarla
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  // Validamos que no tenga ningún error
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Buscar usuario por correo
  User.findOne({ email }).then(user => {
    // Revisamos que el usuario exista
    if (!user) {
      return res.status(404).json({ emailnotfound: "Correo no encontrado" });
    }

    // Validamos que la contraseña guardada sea la misma que la se envia
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //Creamos nuestro payload
        const payload = {
          id: user.id,
          name: user.name
        };

        // Autenticamos con jwtoken
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Contraseña Incorrecta" });
      }
    });
  });
});

router.post("/addquiz", (req, res) => {

  User.findOneAndUpdate(
    {_id: req.body.id}, 
    {
       $push: { 
          games: [{ 
                game: req.body.game, 
                score: req.body.score,
                questions: req.body.questions,
                name: req.body.name
          }] 
       }
   }, 
   { new: true },
   function(err, user) {
        if (err) {
            return res.status(500).send({
                message: err.message || "Some error occured while updating user"
            });
        }
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }
        return res.status(200).send(user);
    }
  );

});

router.post("/getquizbyuser", (req, res) => {
  User.findById(req.body.id,
    function(err, user) {
      if (err) {
          return res.status(500).send({
              message: err.message || "Some error occured while updating user"
          });
      }
      if (!user) {
          return res.status(404).send({
              message: "User not found"
          });
      }
      return res.status(200).send(user);
    }
  );

});

module.exports = router;
