const IUserRepository = require('../interfaces/IUserRepository');

class InMemoryUserRepository extends IUserRepository {
    constructor() {
        super();
        this.users = new Map();
        this.currentId = 1;
    }

    async findById(id) {
        return this.users.get(id) || null;
    }

    async findByUsername(username) {
        return Array.from(this.users.values()).find(u => u.username === username) || null;
    }

    async create(user) {
        const newUser = { ...user, id: this.currentId++ };
        this.users.set(newUser.id, newUser);
        return newUser;
    }

    async update(id, user) {
        if (!this.users.has(id)) return null;
        const updatedUser = { ...this.users.get(id), ...user };
        this.users.set(id, updatedUser);
        return updatedUser;
    }

    async delete(id) {
        return this.users.delete(id);
    }

    async getAll() {
        return Array.from(this.users.values());
    }
}

module.exports = InMemoryUserRepository;
