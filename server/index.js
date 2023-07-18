import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // req.body

// Create a todo
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todo (description) VALUES ($1) RETURNING *',
      [description]
    );
    res.json(newTodo.rows[0]); // Send the newly created todo as the response
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' }); // Send an error response
  }
});

// Get all todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todo');
    res.json(allTodos.rows); // Send the fetched todos as the response
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal server error' }); // Send an error response
  }
  console.log(req.params);
});

//get a todo: 
app.get("/todos/:id", async(req, res) => {

try {
    
    const {id} = req.params;
    const todo = await pool.query("select * from todo where todo_id = $1", [id]);


    res.json(todo.rows[0]);
} catch (error) {
    console.error(error.message);
}
console.log(req.params);
})

//update a todo
app.put("/todos/:id", async(req, res) => {

try {
    
  const {id} = req.params;
  const {description} = req.body;
  const updateTodo = await pool.query("UPDATE todo set description = $1 where todo_id = $2", [description, id]);
  
  res.json();

} catch (error) {

  console.error(error.message);

}
});

//Delete a todo
app.delete("/todos/:id", async(req, res)=> {

  try {
  
    const {id} = req.params;
    const deleteTodo = await pool.query("delete from todo where todo_id = $1", [id]);

    res.json();

  } catch (error) {

    console.error(error.message);

  }

});



// Start the server on port 5000
app.listen(5000, () => {
  console.log('Server has started on Port 5000');
});
