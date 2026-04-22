const UserRepository = require("./UserRepository");

class InMemoryUserRepository extends UserRepository {
  constructor() {
    super();
    this.users = new Map();
    this.nextId = 1;
  }

  async findById(id) {
    return this.users.get(String(id)) || null;
  }

  async findByName(name) {
    for (const user of this.users.values()) {
      if (user.name === name) return user;
    }
    return null;
  }

  async create(user) {
    const id = String(this.nextId++);
    const stored = { ...user, _id: id };
    this.users.set(id, stored);
    return stored;
  }
}

module.exports = InMemoryUserRepository;
