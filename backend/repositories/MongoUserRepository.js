const { ObjectId } = require("mongodb");
const UserRepository = require("./UserRepository");
const { getDB } = require("../db");

class MongoUserRepository extends UserRepository {
  constructor() {
    super();
    this.collectionName = "users";
  }

  collection() {
    return getDB().collection(this.collectionName);
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) return null;
    return this.collection().findOne({ _id: new ObjectId(id) });
  }

  async findByName(name) {
    return this.collection().findOne({ name });
  }

  async create(user) {
    const result = await this.collection().insertOne(user);
    return { ...user, _id: result.insertedId };
  }
}

module.exports = MongoUserRepository;
