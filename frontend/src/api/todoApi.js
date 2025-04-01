// src/api/todoApi.js
import axios from 'axios';

// Replace with your actual API URL from serverless deployment
const API_URL = 'https://your-api-id.execute-api.us-east-1.amazonaws.com/dev';




export const getTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const createTodo = async (todo) => {
  try {
    const response = await axios.post(`${API_URL}/todos`, todo);
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

export const updateTodo = async (id, updates) => {
  try {
    const response = await axios.put(`${API_URL}/todos/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    await axios.delete(`${API_URL}/todos/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};