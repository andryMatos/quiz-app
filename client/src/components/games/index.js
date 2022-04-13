import React, {useState, useEffect} from 'react';
import axios from 'axios';

function Games(auth) {

    const defaultState = {
        game: "",
        score: 0,
        questions: [
            {
                texto: "",
                respuestas: [{
                }]
            }
        ],
        name: "",
    }

    const [games, setGames] = useState([defaultState]);
    const [idUser, setID] = useState(auth.user.id);

    useEffect(()=>{
        getData();
    },[]);

    const getData = () =>{
        const data = {
            id: idUser
        }
        axios.post('/api/users/getquizbyuser',data)
        .then(function (response) {
            console.log("response=>>>>>", response.data.games);
            setGames(response.data.games);
        })
        .catch(function (error) {
          console.log(error);
        });
    };


    return (
        <div className="container">
            <div className="row">
                {games.map((game, index) =>(
                    <div className="card" key={index}>
                        <div className="card-header">
                            {game.name} Tu puntuación: {game.score}
                        </div>
                        {game.questions.map((quest, idx) =>(
                            <ul className="list-group list-group-flush" key={idx}>
                                <h5>Pregunta #{idx + 1} {quest.texto}</h5>
                                {quest.respuestas.map((res, id) => (
                                    res.correcto && res.seleccion ?
                                    <li className="list-group-item list-group-item-success" key={id}>Correcto: {res.texto}</li>
                                    : res.seleccion ? 
                                    <li className="list-group-item list-group-item-warning" key={id}>Tu selección :( :{res.texto}</li>
                                    :
                                    <li className="list-group-item" key={id}>{res.texto}</li>

                                ))}
                            </ul>
                        ))}
                            
                    </div>
                ))}
            
            </div>
        </div>
    )


}

export default Games;