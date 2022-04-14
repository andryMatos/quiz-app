import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


function Row({ onChange, onRemove, texto, correcto }) {
    return (
            <div className="row">
                <div className="col-md-10">
                    <input
                    value={texto}
                    className="form-control"
                    onChange={e => onChange("texto", e.target.value)}
                    placeholder="Respuesta"
                    />
                </div>
                <label>
                    Correcta:
                    <input type="checkbox" value={correcto} onChange={e => onChange("correcto", e.target.value)} />
                </label>
                <div className="col-md-4 offset-md-4">
                    <button type="button" className="btn btn-danger mb-4 mt-4" onClick={onRemove}>Eliminar</button>
                </div>
            </div>
    );
}

function Catalog(auth) {
    const defaultState = {
        texto: "",
        correcto: false,
        seleccion: false
    }
    const defaultQuiz = {
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
    const [rows, setRows] = useState([defaultState]);
    const [questions, setQuestion] = useState([]);
    const [addrtype, setAddrtype] = useState(["Peliculas", "Historia", "Cultura General","Videojuegos", "Música","Cine Mexicano","Deportes"])
    const Add = addrtype.map(Add => Add)
    const [category, setCategory] = useState("");
    const [pregunta, setPregunta] = useState("");
    const [quizName, setQuizName] = useState("");
    const [currentQuiz, setCurrentQuiz] = useState(defaultQuiz);
    const [position, setPosition] = useState(0);
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [showMessageErr, setShowMessageErr] = useState(false);
    const [messageErr, setMessageErr] = useState("");
    const [show, setShow] = useState(false);
    const [modal, setModal] = useState(false);
    const [isOpen, setOpen] = useState(false);

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

    const handleOnChange = (index, name, value) => {
        const copyRows = [...rows];
        if(name=='correcto'){
            if(value == "false"){
                copyRows[index] = {
                    ...copyRows[index],
                    [name]: true
                };
            }
            if(value == "true"){
                copyRows[index] = {
                    ...copyRows[index],
                    [name]: false
                };
            }
        }else{
            copyRows[index] = {
                ...copyRows[index],
                [name]: value
            }; 
        }

        setRows(copyRows);
    };

    const handleOnAdd = () => {
        const totalrows = rows.length;
        if(totalrows >= 10){
            setShowMessageErr(true);
            setMessageErr("Sólo puedes agregar 10 respuestas");
        }else{
            setRows(rows.concat(defaultState));
        }
    };

    const handleOnRemove = index => {
        const copyRows = [...rows];
        copyRows.splice(index, 1);
        setRows(copyRows);
    };

    const handleAddrTypeChange = (e) => {
        setCategory(e.target.value);
    }

    const saveQuestion = () => {
        const data = {
            questions: [],
            name: quizName,
            category: category
        }
        axios.post('/api/quiz/addquiz', data)
          .then(function (response) {
              if(response.statusText = "OK"){
                setPregunta("");
                getData();
                handleClose();
              }
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    const saveAnswer = () => {

        const totalrows = rows.length;
        var result = rows.filter(res => {
            return res.correcto === true
        })

        var totalCorrect = result.length;

        if(totalrows <= 1){
            setShowMessageErr(true);
            setMessageErr("Tienes que agregar minimo 2 respuestas");  
        }else{
            if(totalCorrect <= 0){
                setShowMessageErr(true);
                setMessageErr("Debes elegir una respuesta correcta");
            }else if(totalCorrect >= 2){
                setShowMessageErr(true);
                setMessageErr("No puedes seleccionar dos respuestas como correctas");
            }else{
            const id = currentQuiz._id;
            const preguntas = {
                id:id,
                texto: pregunta,
                respuestas: rows,
            }
    
            axios.post('/api/quiz/addAnswer', preguntas)
              .then(function (response) {
                getData();
                closeEdit();
                setShowMessage(true);
                setMessage("Se ha guardado tu pregunta");
              })
              .catch(function (error) {
                console.log(error);
              });
            }
        }

    }

    //Eventos de la tabla
    const handleView = (data, idx) => {
        setCurrentQuiz(data);
    }

    const handlebind = (data,idx) => {
        closeDelete();
        setCurrentQuiz(data);
        setPosition(indexedDB);
    }

    const handleDelete = (data) => {
        const id = {
            id:currentQuiz._id
        }

        axios.post('/api/quiz/deletequiz', id)
            .then(function (response) {
                if(response){
                    getData();
                    setShowMessage(true);
                    setMessage("Se ha eliminado la trivia correctamente");
                    closeDelete();
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }
    
    const handleEdit = (data, idx) => {
        closeEdit();
        setCurrentQuiz(data);
        setRows([defaultState]);
        setPregunta("");
    }

    const handleClose = () =>{
        setShow(!show);
    };

    const closeEdit = () => {
        setOpen(!isOpen);
    }

    const closeDelete = () => {
        setModal(!modal);
    }

    return (
        <div className="container">
            <div className="row">
                {showMessage ? 
                <div className="alert alert-success">
                    <a href="#" className="close" data-dismiss="alert" aria-label="close" onClick={() => setShowMessage(false)}>&times;</a>
                    <strong>Éxito!</strong> {message}.
                </div>:
                <div></div>
                }
                <div className="col-md-12">
                    <button type="button" className="btn btn-info add-new mb-4" onClick={() => handleClose()} ><i className="material-icons">&#xE03B;</i> Nueva Trivia</button>
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
                                    <button type="button" className="btn btn-primary mr-2" data-toggle="modal" data-target="#exampleModal" onClick={()=> handleView(tr, idx)}>
                                        <i className="material-icons">visibility</i>
                                    </button>
                                    <button type="button" className="btn btn-warning mr-2" onClick={()=> handleEdit(tr, idx)}>
                                        <i className="material-icons">edit</i>
                                    </button>
                                    <button type="button" className="btn btn-danger mr-2" onClick={() => handlebind(tr, idx)}>
                                        <i className="material-icons">delete_outline</i>
                                    </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/*Sección Modales */}
                {/*Modal de ver */}
                <div className="modal fade" id="exampleModal" tabIndex={"-1"} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{currentQuiz.name}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={() => setShowMessageErr(false)}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {currentQuiz.questions.map((q, index) => (
                                <div key={index}>
                                    <h5>Pregunta #{index + 1} {q.texto}</h5>
                                    <ul className="list-group">
                                        {q.respuestas.map((r, idx) => (
                                            r.correcto ?
                                            <li className="list-group-item list-group-item-success" key={idx}>Correcto: {r.texto}</li>
                                            :
                                            <li className="list-group-item" key={idx}>{r.texto}</li>

                                        ))}
                                    </ul>
                                </div>
                            ))
                            }
                            
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Modal Editar */}
                <Modal isOpen={isOpen}>
                    <ModalHeader
                        toggle={closeEdit}>{currentQuiz.name}</ModalHeader>
                    <ModalBody>
                        {showMessageErr ? 
                            <div className="alert alert-danger">
                                <a href="#" className="close" data-dismiss="alert" aria-label="close" onClick={() => setShowMessageErr(false)}>&times;</a>
                                <strong>Atención!</strong> {messageErr}.
                            </div>:
                            <div></div>
                            }
                        <div className="col-md-12">
                            <input
                                value={pregunta}
                                className="form-control mb-4"
                                onChange={e => setPregunta(e.target.value)}
                                placeholder="Escribe tu Pregunta"
                                />
                        </div>
                        {rows.map((row, index) => (
                            <div className="container" key={index}>
                                <Row
                                {...row}
                                onChange={(name, value) => handleOnChange(index, name, value)}
                                onRemove={() => handleOnRemove(index)}
                                key={index}
                                />
                            </div>
                        ))}
                        <div className='col-md-4 offset-md-4'>
                            <button type="button" className="btn btn-success mb-4" onClick={handleOnAdd}>Agregar</button>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={closeEdit}>Cancelar</Button>
                        <Button color="success" onClick={saveAnswer}>Guardar Respuestas</Button>
                    </ModalFooter>
                </Modal>

                {/* Modal Confirmar Eliminar */}
                <Modal isOpen={modal}>
                    <ModalHeader
                        toggle={closeDelete}>{currentQuiz.name}</ModalHeader>
                    <ModalBody>
                        ¿Estas seguro de eliminar esta trivia?
                        <br></br>
                        Esta acción no puede revertirse
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={closeDelete}>Cancelar</Button>
                        <Button color="danger" onClick={handleDelete}>Eliminar</Button>
                    </ModalFooter>
                </Modal>
                
                {/* Modal para agregar la trivia */}
                <Modal isOpen={show}>
                    <ModalHeader
                        toggle={handleClose}>{currentQuiz.name}</ModalHeader>
                    <ModalBody>
                        <div className="form-outline mb-4">
                            <div className="mb-4 mt-4">
                                <label>Selecciona la categoria</label>
                                < select
                                    onChange={e => handleAddrTypeChange(e)}
                                    className="browser-default custom-select" >
                                    {
                                        Add.map((name, key) => <option key={key} value={name}>{name}</option>)
                                    }
                                </select >
                            </div> 
                        </div>
                        <div className="col-md-12">
                            <input
                            value={quizName}
                            className="form-control mb-4"
                            onChange={e => setQuizName(e.target.value)}
                            placeholder="Nombre de tu Trivia"
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleClose}>Cancelar</Button>
                        <Button color="danger" onClick={saveQuestion}>Guardar</Button>
                    </ModalFooter>
                </Modal>

                

            </div>
    </div>
  );
}

export default Catalog;