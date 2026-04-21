const express = require("express");
const cors = require("cors");
require("./db");

const jadwalRoutes = require("./routes/jadwalRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/jadwal", jadwalRoutes);

app.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});