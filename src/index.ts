import "dotenv/config";
import express from "express";
import { apiV1Routes } from "./api/v1/routes.js";
import { config } from "dotenv";
import { errorHandler, notFoundHandler } from "./api/v1/core/middleware/error-handler.js";

config({ path: ".env.development" });

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz
app.get("/", (req, res) => {
  res.json({ message: "API ok!" });
});

// Rotas da API
app.use("/api/v1", apiV1Routes);

// Middleware para rotas não encontradas (404) - deve vir DEPOIS de todas as rotas
app.use(notFoundHandler);

// Middleware de tratamento de erros (deve vir por último)
app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});
