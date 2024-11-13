
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'


function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [filter, setFilter] = useState('all');

  
  useEffect(() => {
    axios.get(`http://localhost:5000/tasks?filter=${filter}`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the tasks!', error);
      });
  }, [filter]);


  const handleAddTask = (e) => {
    e.preventDefault();
    if (taskName) {
      axios.post('http://localhost:5000/tasks', { task_name: taskName })
        .then((response) => {
          setTasks([...tasks, response.data]);
          setTaskName('');
        })
        .catch((error) => {
          console.error('There was an error adding the task!', error);
        });
    }
  };

  
  const handleCompleteTask = (id) => {
    axios.put(`http://localhost:5000/tasks/${id}/complete`)
      .then(() => {
        setTasks(tasks.map(task => 
          task.id === id ? { ...task, is_completed: true } : task
        ));
      })
      .catch((error) => {
        console.error('There was an error completing the task!', error);
      });
  };

  
  const handleDeleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch((error) => {
        console.error('There was an error deleting the task!', error);
      });
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      
      
      <form onSubmit={handleAddTask}>
        <input 
          type="text" 
          value={taskName} 
          onChange={(e) => setTaskName(e.target.value)} 
          placeholder="Add a new task" 
        />
        <button type="submit">Add Task</button>
      </form>

      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>
            {task.task_name}
            {!task.is_completed && (
              <button onClick={() => handleCompleteTask(task.id)}>Complete</button>
            )}
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;