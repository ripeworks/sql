import ServerlessClient from "serverless-postgres";

let client: ServerlessClient;

export function getClient() {
  if (!client) {
    client = new ServerlessClient({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return client;
}
