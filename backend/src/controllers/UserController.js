const jwt = require('jsonwebtoken');

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    async register(req, res) {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: "Falten dades" });
            }
            const user = await this.userService.register(username, password);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await this.userService.login(username, password);
            
            // Generar Token (JWT)
            const token = jwt.sign(
                { id: user.id, username: user.username }, 
                process.env.JWT_SECRET || 'secret_tr3', 
                { expiresIn: '24h' }
            );

            res.json({ user, token });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async getLeaderboard(req, res) {
        try {
            const leaderboard = await this.userService.getLeaderboard();
            res.json(leaderboard);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;
