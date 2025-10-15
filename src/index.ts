import express from "express";
import { apiV1Routes } from "./api/v1/routes.js";
import { config } from "dotenv";
import { errorHandler, notFoundHandler } from "./api/v1/core/middleware/error-handler.js";

const envFile = process.env.NODE_ENV === "production" ? ".env" : ".env.development";
config({ path: envFile });

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.json({ message: "API ok!" });
});

// API Routes
app.use("/api/v1", apiV1Routes);

// Middleware for all not found (404)
app.use(notFoundHandler);

// Error handling middlewares
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server listening at http://localhost:${port}`);
});
