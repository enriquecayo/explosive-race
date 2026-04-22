const IUserRepository = require('../interfaces/IUserRepository');
const { getDB } = require('../../db');
const { ObjectId } = require('mongodb');

class MongoUserRepository extends IUserRepository {
    constructor() {
        super();
        this.collectionName = 'users';
    }

    async getCollection() {
        const db = getDB();
        return db.collection(this.collectionName);
    }

    async findById(id) {
        const collection = await this.getCollection();
        // Handle both string and ObjectId
        const query = typeof id === 'string' ? { _id: new ObjectId(id) } : { _id: id };
        const user = await collection.findOne(query);
        if (user) user.id = user._id.toString();
        return user;
    }

    async findByUsername(username) {
        const collection = await this.getCollection();
        const user = await collection.findOne({ username });
        if (user) user.id = user._id.toString();
        return user;
    }

    async create(user) {
        const collection = await this.getCollection();
        const result = await collection.insertOne(user);
        const newUser = { ...user, id: result.insertedId.toString(), _id: result.insertedId };
        return newUser;
    }

    async update(id, userData) {
        const collection = await this.getCollection();
        const query = typeof id === 'string' ? { _id: new ObjectId(id) } : { _id: id };
        await collection.updateOne(query, { $set: userData });
        return this.findById(id);
    }

    async delete(id) {
        const collection = await this.getCollection();
        const query = typeof id === 'string' ? { _id: new ObjectId(id) } : { _id: id };
        const result = await collection.deleteOne(query);
        return result.deletedCount > 0;
    }

    async getAll() {
        const collection = await this.getCollection();
        const users = await collection.find({}).toArray();
        return users.map(u => ({ ...u, id: u._id.toString() }));
    }
}

module.exports = MongoUserRepository;
