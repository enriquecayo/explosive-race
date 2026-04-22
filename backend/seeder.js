require("dotenv").config();
const { connectDB, getDB } = require("./db");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    console.log("Iniciant seeder...");
    await connectDB();
    const db = getDB();
    const usersCollection = db.collection("users");

    // Comprovem si ja hi ha usuaris
    const count = await usersCollection.countDocuments();
    if (count > 0) {
      console.log(`La base de dades ja té ${count} usuaris. No cal fer seeding.`);
      process.exit(0);
    }

    console.log("Generant usuaris de prova...");
    const hashedPassword = await bcrypt.hash("1234", 10);

    const seedUsers = [
      {
        username: "Enrique",
        password: hashedPassword,
        score: 2500,
        wins: 10,
        createdAt: new Date()
      },
      {
        username: "PlayerOne",
        password: hashedPassword,
        score: 1850,
        wins: 5,
        createdAt: new Date()
      },
      {
        username: "UnityDev",
        password: hashedPassword,
        score: 3200,
        wins: 15,
        createdAt: new Date()
      }
    ];

    await usersCollection.insertMany(seedUsers);
    console.log("Seeding completat amb èxit! S'han creat 3 usuaris.");
    process.exit(0);
  } catch (error) {
    console.error("Error durant el seeding:", error);
    process.exit(1);
  }
}

seed();
