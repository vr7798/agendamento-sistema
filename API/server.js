const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const conectarDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // Rotas de autenticação
const agendamentoRoutes = require("./routes/agendamentoRoutes"); // Rotas de agendamentos
const userRoutes = require("./routes/userRoutes"); // Rotas de usuários
const { proteger } = require("./middleware/authMiddleware"); // Middleware de autenticação

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

// Conectar ao banco de dados
conectarDB();

// Inicializar o app Express
const app = express();

// Middleware para permitir requisições de diferentes origens (CORS)
app.use(cors());

// Middleware para interpretar JSON no corpo das requisições
app.use(express.json());

// Configurar as rotas
app.use("/api/auth", authRoutes); // Rotas de autenticação
app.use("/api/agendamentos", agendamentoRoutes); // Rotas de agendamentos
app.use("/api/users", userRoutes); // Rotas de usuários

// Rota de exemplo protegida por autenticação
app.get("/api/segredo", proteger, (req, res) => {
  res.send("Esta é uma página secreta");
});

// Iniciar o servidor na porta especificada em .env ou na porta 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
