const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express()
app.use(cors())


const db = mysql.createConnection({
    host: 'localhost',  
    user: 'root',
    password: 'Roja_12H',
    database: 'todos',
    port: 3306
  });
  
  db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
  });
  
  app.use(cors());
  app.use(express.json());

app.get('/tasks',(req,res)=>{

   const { filter } = req.query;

  let query = 'SELECT * FROM tasks ORDER BY created_at DESC';
  if (filter === 'completed') {
    query += ' WHERE is_completed = true';
  } else if (filter === 'incomplete') {
    query += ' WHERE is_completed = false';
  }

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});


app.post('/tasks', (req, res) => {
  const { task_name } = req.body;

  const query = 'INSERT INTO tasks (task_name) VALUES (?)';
  db.query(query, [task_name], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ id: result.insertId, task_name, is_completed: false });
    }
  });
});


app.put('/tasks/:id/complete', (req, res) => {
  const { id } = req.params;

  const query = 'UPDATE tasks SET is_completed = true WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Task updated');
    }
  });
});


app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('Task deleted');
    }
  });
});

app.listen(5000, () => {
  console.log(`Server running on http://localhost:${5000}`);
});
