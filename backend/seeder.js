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
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const seedUsers = [
      {
        username: "Enrique",
        password: hashedPassword,
        gamesPlayed: 50,
        itemsUsed: 120,
        coinsCollected: 450,
        deaths: 5,
        gamesWon: 15,
        gamesWonByMonth: { [currentMonthKey]: 15 },
        createdAt: new Date()
      },
      {
        username: "PlayerOne",
        password: hashedPassword,
        gamesPlayed: 30,
        itemsUsed: 85,
        coinsCollected: 210,
        deaths: 12,
        gamesWon: 8,
        gamesWonByMonth: { [currentMonthKey]: 8 },
        createdAt: new Date()
      },
      {
        username: "UnityDev",
        password: hashedPassword,
        gamesPlayed: 75,
        itemsUsed: 200,
        coinsCollected: 890,
        deaths: 3,
        gamesWon: 25,
        gamesWonByMonth: { [currentMonthKey]: 25 },
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
