import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Dashboard = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState("");

    const token = localStorage.getItem("token");

    //gettodos-------------------------------------------
    const getTodos = async () => {

        const res = await axios.get(
            "http://localhost:5000/api/todos",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setTodos(res.data);
    };

    useEffect(() => {
        getTodos();
    }, []);


    //addtodos------------------------------------------
    const addTodo = async () => {
        await axios.post(
            "http://localhost:5000/api/todos",
            {title},
            {
            
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );

        getTodos();
    }

    return (
        <div>
            <h1>Todos</h1>

            <input placeholder='Enter Todo' onChange={(e) => setTitle(e.target.value)}/>
            <button onClick={addTodo}>Add Todo</button>
            {
                todos.map((todo) => (
                    <p key={todo._id}>
                        {todo.title}
                    </p>
                ))
            }
        </div>
    )
}

export default Dashboard;
