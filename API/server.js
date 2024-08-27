// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conectarDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { proteger } = require("./middleware/authMiddleware");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/segredo", proteger, (req, res) => {
  res.send("Esta é uma página secreta");
});

conectarDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
