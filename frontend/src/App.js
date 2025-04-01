// src/App.js
import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api/todoApi';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch todos. Please try again later.');
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (newTodo) => {
    try {
      const createdTodo = await createTodo(newTodo);
      setTodos([...todos, createdTodo]);
    } catch (err) {
      setError('Failed to add todo. Please try again.');
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      const updatedTodo = await updateTodo(id, {
        ...todoToUpdate,
        completed: !todoToUpdate.completed
      });
      
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (err) {
      setError('Failed to update todo. Please try again.');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError('Failed to delete todo. Please try again.');
    }
  };

  if (loading) {
    return <div className="container loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Todo App</h1>
      
      {error && (
        <div className="error">
          {error}
          <button onClick={() => setError(null)}>&times;</button>
        </div>
      )}
      
      <TodoForm addTodo={handleAddTodo} />
      <TodoList 
        todos={todos} 
        toggleComplete={handleToggleComplete} 
        deleteTodo={handleDeleteTodo} 
      />
    </div>
  );
}

export default App;