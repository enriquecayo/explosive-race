require("dotenv").config();
const { MongoClient } = require("mongodb");

let client = null;
let database = null;

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI no definit a .env");
  }
  return uri;
}

function getDbName() {
  return process.env.MONGODB_DB || "projecte";
}

async function connectDB() {
  if (database) {
    return database;
  }

  const uri = getMongoUri();
  client = new MongoClient(uri);

  try {
    await client.connect();
    database = client.db(getDbName());
    console.log("Connectat a MongoDB");
    return database;
  } catch (error) {
    console.error("Error connectant a MongoDB:", error);
    throw error;
  }
}

function getDB() {
  if (!database) {
    throw new Error("Base de dades no connectada! Crida connectDB() primer.");
  }
  return database;
}

async function closeDB() {
  if (!client) return;
  try {
    await client.close();
    database = null;
    client = null;
    console.log("Connexio tancada");
  } catch (error) {
    console.error("Error tancant la connexio:", error);
    throw error;
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB,
};
