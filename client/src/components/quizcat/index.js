import React, {useState, useEffect} from 'react';

function Catalog(){

    const [quiz, setQuiz] = useState([]);


    useEffect(() => {

    },[]);

    return(
        <div class="container">
        <div class="row">
            <div class="col-12">
            <table class="table table-bordered">
                <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Trivia</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">3</th>
                    <td>Guerras Mundiales</td>
                    <td>
                    <button type="button" class="btn btn-primary"><i class="material-icons">visibility</i></button>
                    <button type="button" class="btn btn-success"><i class="material-icons">edit</i></button>
                    <button type="button" class="btn btn-danger"><i class="material-icons">delete_outline</i></button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        </div>
    );

}

export default Catalog;