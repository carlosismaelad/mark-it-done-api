import { Client, QueryResult, QueryConfig } from "pg";
import { ServiceError } from "../errors/errors";

async function query(queryObject: string | QueryConfig): Promise<QueryResult> {
  let client: Client | undefined;
  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const serviceErrorObject = new ServiceError({
      message: "Erro na conexão com o banco ou na Query.",
      cause: error,
    });
    throw serviceErrorObject;
  } finally {
    await client?.end();
  }
}

async function getNewClient(): Promise<Client> {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });
  await client.connect();
  return client;
}

const database = {
  query,
  getNewClient,
};

function getSSLValues(): boolean | { ca: string } {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}

export default database;
