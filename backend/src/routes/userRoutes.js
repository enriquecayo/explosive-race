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

router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));

module.exports = router;
