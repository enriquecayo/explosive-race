/**
 * Contracte per al Repository d'Usuaris
 * @interface
 */
class IUserRepository {
    async findById(id) { throw new Error("Method not implemented"); }
    async findByUsername(username) { throw new Error("Method not implemented"); }
    async create(user) { throw new Error("Method not implemented"); }
    async update(id, user) { throw new Error("Method not implemented"); }
    async delete(id) { throw new Error("Method not implemented"); }
    async getAll() { throw new Error("Method not implemented"); }
}

module.exports = IUserRepository;
