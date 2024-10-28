import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { addUser, getUsers, findUserById, deleteUser } from './services/user-service.js';

// Mongoose Code
dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));

// Express Code
const app = express();
const port = 8000;

// Enable usage of cors and express libraries
app.use(cors());
app.use(express.json());

// Post call to add new user into DB
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  addUser(userToAdd)
    .then((userAdded) => {
      res.status(201).send(userAdded);
    })
    .catch((error) => {
      //Failed to add user.
      res.status(500).send(error);
    })
});

// Delete call to delete user in DB
app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  
  deleteUser(id)
    .then((result) => {
      res.status(204).send("204 User deleted.");
    })
    .catch((error) => {
      res.status(404).send("404 User not found");
    })
});

// Get call to get users list
app.get("/users", (req, res) => {
  const name = req.query.name; //or req.query.['name']
  const job = req.query.job;
  
  getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      //"Failed to fetch users"
      res.status(500).send(error);
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  findUserById(id)
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(404).send("Resource not found.");
      }
    })
    .catch((error) => {
      //Failed to fetch user.
      res.status(500).send(error);
    });
});

app.get("/", (req, res) => {
  res.send("Hello World!!!!!!");
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});