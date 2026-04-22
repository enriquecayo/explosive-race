/**
 * Contracte per al Repository de Partides (Games)
 * @interface
 */
class IGameRepository {
    async findById(id) { throw new Error("Method not implemented"); }
    async create(game) { throw new Error("Method not implemented"); }
    async update(id, game) { throw new Error("Method not implemented"); }
    async delete(id) { throw new Error("Method not implemented"); }
    async getAllActive() { throw new Error("Method not implemented"); }
}

module.exports = IGameRepository;
