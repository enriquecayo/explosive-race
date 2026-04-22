const express = require('express');
const router = express.Router();
const InMemoryUserRepository = require('../repositories/InMemoryUserRepository');
const MongoUserRepository = require('../repositories/MongoUserRepository');
const UserService = require('../services/UserService');
const UserController = require('../controllers/UserController');

// Inicialització manual de les dependències (DI)
const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/users/register', (req, res) => userController.register(req, res));
router.post('/users/login', (req, res) => userController.login(req, res));
router.get('/leaderboard', (req, res) => userController.getLeaderboard(req, res));

module.exports = router;
