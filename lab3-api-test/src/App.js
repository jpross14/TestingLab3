import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/todos';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const addTask = async () => {
    if (task.trim()) {
      try {
        const newTask = { task };
        await axios.post(API_URL, newTask);
        setTask('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task', error);
      }
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      await axios.put(`${API_URL}/${id}`, { task: updatedTask });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleEdit = (id, currentTask) => {
    const newTask = prompt('Edit your task:', currentTask);
    if (newTask) {
      updateTask(id, newTask);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={handleInputChange}
          placeholder="Enter a new task"
        />
        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((taskItem) => (
          <li key={taskItem.id}>
            {taskItem.task}
            <button onClick={() => handleEdit(taskItem.id, taskItem.task)}>Edit</button>
            <button onClick={() => deleteTask(taskItem.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;