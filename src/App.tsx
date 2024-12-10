import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';


interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  // Fetch todos from the JSONPlaceholder API
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/todos')
      .then((response) => {
        setTodos(response.data.slice(0, 20));
      })
      .catch((error) => console.log(error));
  }, []);

  // Add new Todo
  const handleAddTodo = () => {
    if (!newTodo) return;
    const newTodoObj = {
      id: Math.random(),
      title: newTodo,
      completed: false,
    };
    setTodos([...todos, newTodoObj]);
    setNewTodo('');
  };

  // Toggle the completion status of a Todo
  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete Todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Filter Todos based on the selected filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'pending') return !todo.completed;
    return true;
  });

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setFilter(newAlignment as 'all' | 'completed' | 'pending');
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div style={{"margin": "10px"}}>
      <TextField style={{"margin": "10px"}} value={newTodo}  onChange={(e) => setNewTodo(e.target.value)} id="outlined-basic" label="Add a new task" variant="standard" fullWidth/>
      <Button style={{"margin": "10px"}} variant="outlined" onClick={handleAddTodo}>Add Task</Button>
      </div>

      <div className='toggle-container'>
        <ToggleButtonGroup
          color="primary"
          value={filter}
          exclusive
          onChange={handleChange}
          aria-label="Todo Filter"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="completed">Completed</ToggleButton>
          <ToggleButton value="pending">Pending</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <Checkbox onChange={() => toggleComplete(todo.id)}  checked={todo.completed}  />
            <span>{todo.title}</span>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              <i className="fa fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
