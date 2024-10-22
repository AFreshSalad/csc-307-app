import express from "express";
import cors from "cors";
import { addUser, getUsers, findUserById, findUserByName, findUserByJob } from "user-service";

const app = express();
const port = 8000;

//delete this functionality
const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter(user => {
    return (!name || user.name === name) && (!job || user.job === job);
  });
};

//add this functionality later in user-service
const deleteUser = (id) => {
  const index = users["users_list"].findIndex(user => user.id === id);
  if (index !== -1) {
    users["users_list"].splice(index, 1);
    return true;
  }
  return false;
};

// Enable usage of cors and express libraries
app.use(cors());
app.use(express.json());

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

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const result = deleteUser(id);
  if (result) {
    res.status(204).send("204 User deleted.");
  } else {
    res.status(404).send("404 User not found");
  }
});

//need to adjust this later with name and job requests
app.get("/users", (req, res) => {
  const name = req.query.name; //or req.query.['name']
  const job = req.query.job;
  
  if (name != undefined) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
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