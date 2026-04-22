const IGameRepository = require('../interfaces/IGameRepository');

class InMemoryGameRepository extends IGameRepository {
    constructor() {
        super();
        this.games = new Map();
        this.currentId = 1;
    }

    async findById(id) {
        return this.games.get(id) || null;
    }

    async create(game) {
        const newGame = { ...game, id: this.currentId++, status: 'waiting' };
        this.games.set(newGame.id, newGame);
        return newGame;
    }

    async update(id, game) {
        if (!this.games.has(id)) return null;
        const updatedGame = { ...this.games.get(id), ...game };
        this.games.set(id, updatedGame);
        return updatedGame;
    }

    async delete(id) {
        return this.games.delete(id);
    }

    async getAllActive() {
        return Array.from(this.games.values()).filter(g => g.status !== 'finished');
    }
}

module.exports = InMemoryGameRepository;
