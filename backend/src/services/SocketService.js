const { WebSocketServer, WebSocket } = require('ws');

class SocketService {
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.rooms = new Map(); // Map de roomName -> Set de clients
        this.init();
    }

    init() {
        this.wss.on('connection', (ws) => {
            console.log('Nova connexió WebSocket establerta');
            ws.isAlive = true;

            ws.on('pong', () => { ws.isAlive = true; });

            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    this.handleMessage(ws, message);
                } catch (e) {
                    console.error('Error parsejant missatge WS:', e);
                }
            });

            ws.on('close', () => {
                this.handleDisconnect(ws);
            });
        });

        // Interval per netejar connexions mortes
        const interval = setInterval(() => {
            this.wss.clients.forEach((ws) => {
                if (ws.isAlive === false) return ws.terminate();
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);

        this.wss.on('close', () => clearInterval(interval));
    }

    handleMessage(ws, message) {
        const { type, payload } = message;

        switch (type) {
            case 'JOIN_ROOM':
                this.joinRoom(ws, payload.roomName, payload.username);
                break;
            case 'START_GAME':
                this.startGame(ws);
                break;
            case 'MOVE':
            case 'ACTION':
                this.broadcastToRoom(ws, message);
                break;
            default:
                console.log('Tipus de missatge desconegut:', type);
        }
    }

    joinRoom(ws, roomName, username) {
        if (!this.rooms.has(roomName)) {
            this.rooms.set(roomName, new Set());
        }

        const room = this.rooms.get(roomName);
        
        if (room.size >= 3) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: 'La sala està plena' }));
            return;
        }

        // Assignem l'índex disponible (0, 1 o 2)
        const usedIndexes = Array.from(room).map(client => client.playerIndex);
        let index = 0;
        while (usedIndexes.includes(index)) index++;

        ws.roomName = roomName;
        ws.username = username;
        ws.playerIndex = index;
        room.add(ws);

        console.log(`Usuari ${username} (Index: ${index}) s'ha unit a: ${roomName}`);
        
        this.broadcastToRoom(ws, { 
            type: 'USER_JOINED', 
            payload: { username, playerIndex: index, playerCount: room.size } 
        }, true);
    }

    startGame(ws) {
        const roomName = ws.roomName;
        if (!roomName || !this.rooms.has(roomName)) return;

        const room = this.rooms.get(roomName);
        
        // Preparem la llista de jugadors
        const playersList = Array.from(room).map(client => ({
            username: client.username,
            index: client.playerIndex
        }));

        console.log(`Iniciant partida a la sala ${roomName} amb ${playersList.length} jugadors`);

        // Enviem a TOTHOM la llista per fer el Spawn
        this.broadcastToRoom(ws, {
            type: 'START_GAME',
            payload: { players: playersList }
        }, true);
    }

    broadcastToRoom(ws, message, includeSelf = false) {
        const roomName = ws.roomName;
        if (!roomName || !this.rooms.has(roomName)) return;

        const room = this.rooms.get(roomName);
        const data = JSON.stringify(message);

        room.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if (includeSelf || client !== ws) {
                    client.send(data);
                }
            }
        });
    }

    handleDisconnect(ws) {
        const roomName = ws.roomName;
        if (roomName && this.rooms.has(roomName)) {
            const room = this.rooms.get(roomName);
            room.delete(ws);
            if (room.size === 0) {
                this.rooms.delete(roomName);
            } else {
                this.broadcastToRoom(ws, { 
                    type: 'USER_LEFT', 
                    payload: { username: ws.username } 
                });
            }
        }
        console.log('Connexió tancada');
    }
}

module.exports = SocketService;
