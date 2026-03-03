import { Router } from "express";
import pool from "../db.js";

const router = Router();

// create a todo 
//which will be a post request to the server
router.post("/", async (req, res) => {
    try{
        
        const { description, completed } = req.body; //extracting or destructuring the description and completed from the request body
        if(!description){ //if the description is not provided in the request body, return a bad request error
            return res.status(400).json({ message: "Description is required" });
        }
        const newTodo = await pool.query(
            "INSERT INTO todo (description, completed) VALUES ($1, $2) RETURNING *", //the query to insert a new todo into the database
            [description, completed || false]) //the values to be inserted into the database
        res.json(newTodo.rows[0]) //returning the newly created todo as a response

    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
})

// get all todos
router.get("/", async (req, res) => {
    try {
        const allTodos = await pool.query(
            "SELECT * FROM todo" //the query to select all todos from the database
        )
        res.json(allTodos.rows) //returning all the todos as a response

    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error")
    }

})


// update a todo
router.put("/:id", async (req, res) => {
    try {
        const {id} = req.params; //extracting the id from the request parameters
        const {description, completed} = req.body; //extracting the description and completed from the request body
        if(!description){ //if the description is not provided in the request body, return a bad request error
            return res.status(400).json({ message: "Description is required" });
        }
        const updateTodo = await pool.query(
            "UPDATE todo SET description = $1, completed = $2 WHERE todo_id = $3 RETURNING *", //the query to update a todo in the database
            [description, completed || false, id] //the values to be updated in the database
        );
        if(updateTodo.rowCount === 0){ //if no rows were updated, it means the todo with the given id was not found
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({
            message: "Todo was updated successsfully",
            todo: updateTodo.rows[0]
        }) //returning the updated todo as a response

    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error")
    }
    
})

// delete a todo

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params; //extracting the id from the request parameters
        const deleteTodo = await pool.query(
            "DELETE FROM todo WHERE todo_id = $1 RETURNING *", //the query to delete a todo from the database
            [id] //the value to be deleted from the database
        );
        if(deleteTodo.rowCount === 0){ //if no rows were deleted, it means the todo with the given id was not found
            return res.status(404).json({ message: "Todo not found" });
        }
        res.json({
            message: "Todo was deleted successfully",
            todo: deleteTodo.rows[0]
        }) //returning the deleted todo as a response

    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Server Error")
    }
})

export default router;