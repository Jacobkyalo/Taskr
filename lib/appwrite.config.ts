import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.API_ENDPOINT as string)
  .setProject(process.env.PROJECT_ID as string);

export const account = new Account(client);
export const database = new Databases(client);
export const COLLECTION_ID = process.env.COLLECTION_ID as string;
export const DB_ID = process.env.DB_ID as string;

// export default client;
