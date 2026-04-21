const express = require("express");
const cors = require("cors");
const db = require("./db"); 

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend jalan!");
});

app.get("/jadwal", (req, res) => {
  db.query("SELECT * FROM jadwal", (err, result) => {
    if (err) {
      return res.send(err);
    }
    res.json(result);
  });
});

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});