require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const userRoutes = require("./src/routes/userRoutes");
const SocketService = require("./src/services/SocketService");
const { connectDB } = require("./db");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Inicialització de WebSockets
const socketService = new SocketService(server);

// Rutes HTTP
app.use("/api", userRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    mode: "MongoDB (Atlas)",
    websockets: "active",
    activeRooms: socketService.rooms.size
  });
});

connectDB().then(() => {
    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server corrent en el port ${PORT}`);
        console.log(`Backend de la TR3 iniciat a http://localhost:${PORT}`);
        console.log(`WebSockets escoltant al fameix port.`);
    });
}).catch(err => {
    console.error("No s'ha pogut iniciar el servidor perquè ha fallat la connexió a la DB:", err);
});
