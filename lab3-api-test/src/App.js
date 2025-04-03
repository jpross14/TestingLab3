import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [currentDB, setCurrentDB] = useState('development'); // Default to development DB

  // Set API URL based on the selected database
  const API_URL = currentDB === 'development' 
    ? 'http://localhost:5000/todos' 
    : 'http://localhost:5001/todos';

  // Fetch tasks from the selected API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  // Create a new task
  const addTask = async () => {
    if (task.trim()) {
      try {
        const newTask = { task };
        await axios.post(API_URL, newTask);  // Send the new task to the selected DB
        setTask('');
        fetchTasks(); // Refresh the task list after adding
      } catch (error) {
        console.error('Error adding task', error);
      }
    }
  };

  // Update an existing task
  const updateTask = async (id, updatedTask) => {
    try {
      await axios.put(`${API_URL}/${id}`, { task: updatedTask });  // Update the task on the selected DB
      fetchTasks(); // Refresh the task list after updating
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);  // Delete the task from the selected DB
      fetchTasks(); // Refresh the task list after deletion
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  // Handle task edit
  const handleEdit = (id, currentTask) => {
    const newTask = prompt('Edit your task:', currentTask);
    if (newTask) {
      updateTask(id, newTask);
    }
  };

  // Fetch tasks on component mount or when currentDB changes
  useEffect(() => {
    fetchTasks();
  }, [currentDB]);

  return (
    <div className="App">
      <h1>To-Do List</h1>
      
      {/* Switch DB */}
      <div>
        <button onClick={() => setCurrentDB('development')}>Use Development DB</button>
        <button onClick={() => setCurrentDB('test')}>Use Test DB</button>
      </div>
      
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
