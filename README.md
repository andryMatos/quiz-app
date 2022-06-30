# Quiz Application
Quiz App is a quiz app (obviously), with some basic skills. This is a simple task, which you can finish in an afternoon. The goal is for you to apply the knowledge required for your position. We expect to receive your results within 24 hours if possible, and you have up to 72 hours after receiving this task to send us your application.

## Pages

1. Registration
2. Login
3. List of questionnaires
4. Create, Detail (list of questions), Play
5. Create a question / Create answer options / Demonstrate that the application works.
6. Question list, Create, Preview
7. Results, show questions with their answers (correct/incorrect) 
 
## Features

* Users can register and log in to the application with a username and password. The application can remember and self-register when they revisit the application.
* Users can list/create/edit/delete and play quizzes
* Users can list/create/edit/delete questions on the questionnaire detail page.
* Users can create simple choice type questions with a question text and options (minimum 2, maximum 10 options).
* Users must select one option as the correct choice in the questionnaire creation screen.
* Users can play these quizzes (Users can log out and the application will not automatically log them in if they log out). 

## Technologies

* For the database, you can use MongoDB (required) with mongoose (optional) - Create a Node.JS API (required) with Express.js (optional)
* Create a single-page application with React/redux and use the Node.js api to communicate with the server
* The list of questions must be in redux and update the redux status when creating/editing/deleting the questionnaire.
* The list of questions can be in redux or you can extract the questions from the API when the user clicks on the quiz detail or on the playback.
* You can use any UI framework such as bootstrap, ant design or material - UI
