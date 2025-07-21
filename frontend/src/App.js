import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchTasks();
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE}/health`);
      setStatus(`Backend Status: ${response.data.status}`);
    } catch (error) {
      setStatus('Backend Status: Disconnected');
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setStatus('Error: Unable to fetch tasks');
    }
    setLoading(false);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(`${API_BASE}/tasks`, {
        title: newTask,
        description: `Task created at ${new Date().toLocaleString()}`
      });
      setTasks([...tasks, response.data]);
      setNewTask('');
      setStatus('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      setStatus('Error: Unable to add task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
      setStatus('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      setStatus('Error: Unable to delete task');
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const response = await axios.put(`${API_BASE}/tasks/${id}`, {
        completed: !completed
      });
      setTasks(tasks.map(task => 
        task.id === id ? response.data : task
      ));
      setStatus('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      setStatus('Error: Unable to update task');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Task Manager</h1>
        <div className="status-bar">
          <span className={status.includes('Error') ? 'error' : 'success'}>
            {status}
          </span>
          <button onClick={checkHealth} className="refresh-btn">
            Refresh Status
          </button>
        </div>
      </header>

      <main className="App-main">
        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task..."
            className="task-input"
          />
          <button type="submit" className="add-btn">Add Task</button>
        </form>

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <div className="tasks-container">
            <h2>Tasks ({tasks.length})</h2>
            {tasks.length === 0 ? (
              <p className="no-tasks">No tasks yet. Add one above!</p>
            ) : (
              <ul className="tasks-list">
                {tasks.map(task => (
                  <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    <div className="task-content">
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                      <small>Created: {new Date(task.created_at).toLocaleString()}</small>
                    </div>
                    <div className="task-actions">
                      <button 
                        onClick={() => toggleTask(task.id, task.completed)}
                        className={`toggle-btn ${task.completed ? 'complete' : 'incomplete'}`}
                      >
                        {task.completed ? 'Undo' : 'Complete'}
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
