const userController = require('../controllers/userController');

module.exports = (app) => {
    app.get('/users', userController.getAllUsers);
    app.post('/users', userController.createUser);
    app.get('/users/:id', userController.getUserById);
    app.put('/users/:id', userController.updateUser);
    app.delete('/users/:id', userController.deleteUser);
};