const bcrypt = require('bcryptjs');

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async register(username, password) {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new Error("L'usuari ja existeix");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await this.userRepository.create({
            username,
            password: hashedPassword,
            score: 0,
            wins: 0
        });

        // No retornem la contrasenya
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async login(username, password) {
        const user = await this.userRepository.findByUsername(username);
        if (!user) {
            throw new Error("Usuari o contrasenya incorrectes");
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error("Usuari o contrasenya incorrectes");
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getUserProfile(id) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new Error("Usuari no trobat");
        
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}

module.exports = UserService;
