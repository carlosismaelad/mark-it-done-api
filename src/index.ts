import "dotenv/config";
import Fastify from "fastify";
import { apiV1Routes } from "./api/v1/routes.js";
import { config } from "dotenv";

// Carregar variáveis de ambiente do arquivo correto
config({ path: ".env.development" });

const isDevelopment = process.env.NODE_ENV !== "production";

const server = Fastify({
  logger: isDevelopment
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
            singleLine: false,
          },
        },
      }
    : true,
});

await server.register(apiV1Routes, { prefix: "/api/v1" });

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server listening at ${address}`);
});

server.get("/", (request, reply) => {
  reply.send({ hello: "world" });
});
