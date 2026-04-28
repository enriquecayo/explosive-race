const { randomUUID } = require('crypto');
const { WebSocketServer, WebSocket } = require('ws');

class SocketService {
    constructor(server) {
        this.wss = new WebSocketServer({ server });
        this.rooms = new Map(); // Map de roomName -> Set de clients
        this.socketIdToUserId = new Map();
        this.nextGeneratedUserId = 1;
        this.init();
    }

    init() {
        this.wss.on('connection', (ws) => {
            ws.socketId = randomUUID();
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
                this.joinRoom(ws, payload?.roomName, payload?.username);
                break;
            case 'START_GAME':
                this.startGame(ws);
                break;
            case 'MOVE':
                this.handleMove(ws, payload);
                break;
            case 'ACTION':
                this.handleAction(ws, payload);
                break;
            default:
                console.log('Tipus de missatge desconegut:', type);
        }
    }

    joinRoom(ws, roomName, username) {
        const cleanRoomName = typeof roomName === 'string' ? roomName.trim() : '';
        const cleanUsername = typeof username === 'string' ? username.trim() : '';

        if (!cleanRoomName || !cleanUsername) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: 'Falten dades per unir-se a la sala' }));
            return;
        }

        // Si el client ja era en una sala, el traiem abans de reassignar-lo.
        if (ws.roomName) {
            this.removeClientFromRoom(ws, true);
        }

        if (!this.rooms.has(cleanRoomName)) {
            this.rooms.set(cleanRoomName, new Set());
        }

        const room = this.rooms.get(cleanRoomName);
        
        if (room.size >= 3) {
            ws.send(JSON.stringify({ type: 'ERROR', payload: 'La sala està plena' }));
            return;
        }

        // Assignem l'índex disponible (0, 1 o 2)
        const usedIndexes = Array.from(room).map(client => client.playerIndex);
        let index = 0;
        while (usedIndexes.includes(index)) index++;

        ws.roomName = cleanRoomName;
        ws.username = cleanUsername;
        ws.userId = this.getOrCreateGeneratedUserId(ws.socketId);
        ws.playerIndex = index;
        room.add(ws);

        console.log(`Usuari ${ws.username} (socketId: ${ws.socketId}, userId: ${ws.userId}, Index: ${index}) s'ha unit a: ${cleanRoomName}`);
        
        // Enviem identitat completa perquè frontend pugui mapar per socketId (únic).
        const joinedPayload = this.buildPlayerState(ws);
        joinedPayload.playerCount = room.size;
        this.broadcastToRoom(ws, { 
            type: 'USER_JOINED', 
            payload: joinedPayload
        }, true);

        this.broadcastPlayerList(cleanRoomName);
    }

    startGame(ws) {
        const roomName = ws.roomName;
        if (!roomName || !this.rooms.has(roomName)) return;

        const room = this.rooms.get(roomName);
        
        // Preparem la llista de jugadors
        const playersList = this.getRoomPlayers(roomName);

        console.log(`Iniciant partida a la sala ${roomName} amb ${playersList.length} jugadors`);

        // Enviem a TOTHOM la llista per fer el Spawn
        this.broadcastToRoom(ws, {
            type: 'START_GAME',
            payload: { players: playersList }
        }, true);
    }

    broadcastPlayerList(roomName) {
        if (!roomName || !this.rooms.has(roomName)) return;

        const room = this.rooms.get(roomName);
        const players = this.getRoomPlayers(roomName);

        const message = JSON.stringify({
            type: 'UPDATE_PLAYER_LIST',
            payload: {
                roomName,
                playerCount: players.length,
                players
            }
        });

        room.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
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

    handleMove(ws, payload) {
        if (!ws.roomName || !this.rooms.has(ws.roomName)) return;
        if (!payload || !payload.position) return;

        const facingDirection = Number(payload.facingDirection);
        const message = {
            type: 'MOVE',
            payload: {
                username: ws.username,
                userId: ws.userId,
                socketId: ws.socketId,
                playerIndex: ws.playerIndex,
                position: payload.position,
                facingDirection: Number.isFinite(facingDirection) ? facingDirection : 1
            }
        };

        this.broadcastToRoom(ws, message);
    }

    handleAction(ws, payload) {
        if (!ws.roomName || !this.rooms.has(ws.roomName)) return;
        if (!payload) return;

        const actionPayload = {
            ...payload,
            username: ws.username,
            userId: ws.userId,
            socketId: ws.socketId,
            playerIndex: ws.playerIndex
        };

        this.broadcastToRoom(ws, {
            type: 'ACTION',
            payload: actionPayload
        });
    }

    buildPlayerState(client) {
        return {
            username: client.username,
            userId: client.userId || 0,
            id: client.userId || 0,
            socketId: client.socketId,
            index: client.playerIndex,
            playerIndex: client.playerIndex
        };
    }

    getRoomPlayers(roomName) {
        if (!roomName || !this.rooms.has(roomName)) return [];
        const room = this.rooms.get(roomName);
        const bySocketId = new Map();

        Array.from(room).forEach((client) => {
            if (!client || !client.socketId) return;
            bySocketId.set(client.socketId, this.buildPlayerState(client));
        });

        return Array.from(bySocketId.values()).sort((a, b) => a.index - b.index);
    }

    removeClientFromRoom(ws, notify = true) {
        const roomName = ws.roomName;
        if (!roomName || !this.rooms.has(roomName)) return;

        const room = this.rooms.get(roomName);
        room.delete(ws);

        if (room.size === 0) {
            this.rooms.delete(roomName);
        } else if (notify) {
            this.broadcastToRoom(ws, {
                type: 'USER_LEFT',
                payload: {
                    username: ws.username,
                    userId: ws.userId || 0,
                    socketId: ws.socketId
                }
            });
            this.broadcastPlayerList(roomName);
        }

        ws.roomName = null;
        ws.playerIndex = null;
    }

    handleDisconnect(ws) {
        this.removeClientFromRoom(ws, true);
        if (ws.socketId) {
            this.socketIdToUserId.delete(ws.socketId);
        }
        console.log('Connexió tancada');
    }

    getOrCreateGeneratedUserId(socketId) {
        if (!socketId) return 0;
        if (this.socketIdToUserId.has(socketId)) {
            return this.socketIdToUserId.get(socketId);
        }

        const generatedUserId = this.nextGeneratedUserId++;
        this.socketIdToUserId.set(socketId, generatedUserId);
        return generatedUserId;
    }
}

module.exports = SocketService;
