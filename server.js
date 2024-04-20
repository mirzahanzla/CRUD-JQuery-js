const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());

app.get("/api/users", (req, res) => {
  fs.readFile("data.json", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      const users = JSON.parse(data);
      res.json(users);
    }
  });
});

// Endpoint to add a new user
app.post("/api/users", (req, res) => {
  const newUser = req.body;

  fs.readFile("data.json", (err, data) => {
    if (err) {
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      let users = JSON.parse(data);
      // Add the new user
      users.push(newUser);

      fs.writeFile("data.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(201).json({ message: "User added successfully" });
        }
      });
    }
  });
});

app.put("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let users = JSON.parse(data);
    const index = users.findIndex((user) => user.id === parseInt(userId));
    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users[index] = { ...users[index], ...updatedUser };

    fs.writeFile("data.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "User updated successfully", user: users[index] });
    });
  });
});

app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  console.log(typeof userId);
  fs.readFile("data.json", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let users = JSON.parse(data);
    const index = users.findIndex((user) => user.id === parseInt(userId));
    if (index == -1) {
      return res.status(404).json({ error: "User not found" });
    }

    users.splice(index, 1);

    fs.writeFile("data.json", JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({ message: "User deleted successfully" });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
