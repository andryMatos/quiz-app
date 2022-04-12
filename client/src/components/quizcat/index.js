import React, {useState, useEffect} from 'react';
import { saveQuiz } from '../../actions/quizActions';
import axios from 'axios';

function Row({ onChange, onRemove, texto, correcto}) {
    return (
        <div className="container">
            <div className="form-outline mb-4">
                <input
                className="form-control"
                value={texto}
                onChange={e => onChange("texto", e.target.value)}
                placeholder="Escribe tu Respuesta"
                />
                <input type="radio" value={correcto} id="correcto"
                    onChange={e => onChange("correcto", e.target.value)} name="correcto"/>
                <label>Respuesta Correcta</label>
            </div>
            <div className="form-outline mb-4">
                <button type="button" className="btn btn-danger" onClick={onRemove}>Eliminar</button>
            </div>
        </div>
    );
}

function Catalog(){

    const defaultState = {
        pregunta: "",
        respuestas:[{
            texto: "",
            correcto: false,
            seleccion: false
        }]
    }
    const [rows, setRows] = useState([defaultState]);
    const [questions, setQuestion] = useState([]);
    const [addrtype, setAddrtype] = useState(["Peliculas", "Historia", "Cultura General"])
    const Add = addrtype.map(Add => Add)
    const [category, setCategory] = useState("");

    useEffect(() => {
        getData();
    },[]);

    const getData = () =>{
        axios.post('/api/quiz/getquizz')
        .then(function (response) {
          setQuestion(response.data.lista_quiz);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    //Metodo para hacer el cambio del texto de pregunta
    const handleOnChange = (index, name, value) => {
        const copyRows = [...rows];
        if(name == "correcto"){
            copyRows[index] = {
            ...copyRows[index],
                [name]: value
            }; 
            console.log(copyRows);
        }else{
            copyRows[index] = {
            ...copyRows[index],
                [name]: value
            };
        }
        setRows(copyRows);
    };

    const handleOnAdd = () => {
        setRows(rows.concat(defaultState));
    };

    const handleOnRemove = index => {
        const copyRows = [...rows];
        copyRows.splice(index, 1);
        setRows(copyRows);
    };

    const handleOnRemoveA= (index, idx) => {
        const copyRows = [...rows];
        copyRows[index].respuestas.splice(idx, 1);
        setRows(copyRows);
    }

    const saveQuestion = () => {
        const data = {
            questions: rows,
            name: "Aleatorio",
            category: category
        }
        console.log("Data =>>>>>>>>>>>>>", data);
        {/*
        axios.post('/api/quiz/addquiz', data)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });*/}
    }

    const handleAddrTypeChange = (e) => {
        setCategory(e.target.value);
    }

    const handleOnChangeA = (idx, name, value, index) => {
        const copyRows = [...rows];
        if(name == "correcto" && value =='false'){
            copyRows[index].respuestas[idx] = {
            ...copyRows[index].respuestas[idx],
                'correcto': true
            }; 
        }else{
            copyRows[index].respuestas[idx] = {
                ...copyRows[index].respuestas[idx],
                [name]: value
            }; 
        }
        console.log(copyRows);

        setRows(copyRows);
    }

    const handleAddA = (idx, index) => {

        //setRows(rows[index].respuestas.concat(defaultState.respuestas));
        console.log("ADD BY DATA =>>>>>>>>>", rows[index].respuestas = rows[index].respuestas.concat(defaultState.respuestas));
        setRows(rows);

    }

    return(
        <div className="container">
            <div className="row">
            <div className="col-md-12">
                <div className="form-outline mb-4">
                    <div className="mb-4 mt-4">
                        < select
                            onChange={e => handleAddrTypeChange(e)}
                            className="browser-default custom-select" >
                            {
                                Add.map((name, key) => <option key={key} value={name}>{name}</option>)
                            }
                        </select >
                    </div>
                    
                </div>
                {Object.values(rows).map((row, index) => (
                    <div key={index}>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-10">
                                    <div className="form-group">
                                        <input
                                            className="form-control mb-4"
                                            value={row.pregunta}
                                            name="texto"
                                            placeholder="Escribe tu Pregunta"
                                            onChange={(e) => handleOnChange(index, "pregunta", e.target.value)}
                                            />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <button type="button" className="btn btn-danger" onClick={() => handleOnRemove(index)}>Eliminar</button>
                                </div>
                            </div>
                        </div>
                        {row.respuestas.map((p, idx) => (
                            <div key={idx}>
                                <Row
                                {...row}
                                onChange={(name, value) => handleOnChangeA(idx, name, value, index)}
                                onRemove={() => handleOnRemoveA(index,idx)}
                                key={idx}
                                />
                                <button type="button" className="btn btn-success ml-4 mb-4" onClick={() => handleAddA(idx, index) }>Agregar Respuesta</button>

                            </div>
                        ))}
                        
                    </div>
                ))}
                <button type="button" className="btn btn-success mb-4" onClick={handleOnAdd}>Agregar</button>
                <button type="button" className="btn btn-primary ml-4 mb-4" onClick={saveQuestion}>Guardar</button>
            </div>
                <div className="col-md-12">
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th scope="col">Trivia</th>
                            <th scope="col">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {questions.map((tr, idx) =>(
                                <tr key={idx}>
                                    <td>{tr.name}</td>
                                    <td>
                                    <button type="button" className="btn btn-primary"><i className="material-icons">visibility</i></button>
                                    <button type="button" className="btn btn-success"><i className="material-icons">edit</i></button>
                                    <button type="button" className="btn btn-danger"><i className="material-icons">delete_outline</i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        {/* Area de Modales */}


        </div>
    );

}

export default Catalog;