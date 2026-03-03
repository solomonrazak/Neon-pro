// installed pg to connect to postgres database

import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();


app.use(cors()); // to enable cors for all routes, allowing cross-origin requests from the frontend to the backend
app.use(express.json()); // to parse incoming JSON requests and make the data available in req.body, allowing us to easily access the data sent from the frontend when creating or updating todos

app.use("/todos", todoRoutes)


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});


