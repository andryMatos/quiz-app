const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Creamos el Quiz
const QuizSchema = new Schema({
    name: {
        type: String
    },
    questions: {
        type: [
            Schema.Types.Mixed
        ]
      },
    category: {
        type: String
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});

module.exports = Quiz = mongoose.model("quiz",QuizSchema);
