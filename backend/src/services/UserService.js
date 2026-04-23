const bcrypt = require('bcryptjs');

function toNonNegativeNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function getCurrentMonthKey() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}`;
}

function getCurrentMonthGamesWon(user) {
    const monthKey = getCurrentMonthKey();

    if (user?.gamesWonByMonth && typeof user.gamesWonByMonth === 'object') {
        return toNonNegativeNumber(user.gamesWonByMonth[monthKey]);
    }

    if (Array.isArray(user?.monthlyStats)) {
        const monthStats = user.monthlyStats.find(entry => entry?.month === monthKey);
        if (monthStats) {
            return toNonNegativeNumber(monthStats.gamesWon);
        }
    }

    return toNonNegativeNumber(user?.gamesWon);
}

function sanitizeUser(user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

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
            gamesPlayed: 0,
            itemsUsed: 0,
            coinsCollected: 0,
            deaths: 0,
            gamesWon: 0,
            gamesWonByMonth: {
                [getCurrentMonthKey()]: 0,
            },
        });

        return sanitizeUser(newUser);
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

        return sanitizeUser(user);
    }

    async getUserProfile(id) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new Error("Usuari no trobat");

        return sanitizeUser(user);
    }

    async getUserStatistics(id) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new Error("Usuari no trobat");

        const month = getCurrentMonthKey();

        return {
            id: user.id,
            username: user.username,
            gamesPlayed: toNonNegativeNumber(user.gamesPlayed),
            gamesWon: toNonNegativeNumber(user.gamesWon),
            monthlyGamesWon: getCurrentMonthGamesWon(user),
            itemsUsed: toNonNegativeNumber(user.itemsUsed),
            coinsCollected: toNonNegativeNumber(user.coinsCollected),
            deaths: toNonNegativeNumber(user.deaths),
            month,
        };
    }

    async getLeaderboard() {
        const users = await this.userRepository.getAll();

        return users
            .map(user => ({
                id: user.id,
                username: user.username,
                monthlyGamesWon: getCurrentMonthGamesWon(user),
            }))
            .sort((a, b) => b.monthlyGamesWon - a.monthlyGamesWon)
            .slice(0, 10)
            .map((user, index) => ({
                id: user.id,
                username: user.username,
                position: index + 1,
                gamesWon: user.monthlyGamesWon,
            }));
    }
}

module.exports = UserService;
