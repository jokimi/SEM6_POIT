const userModel = require('../models/userModel');

exports.getAllUsers = (req, res) => {
    const users = userModel.getAll();
    res.json(users);
};

exports.createUser = (req, res) => {
    const newUser = userModel.create(req.body);
    res.status(201).json(newUser);
};

exports.getUserById = (req, res) => {
    const user = userModel.getById(Number(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
};

exports.updateUser = (req, res) => {
    const updated = userModel.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).send('User not found');
    res.json(updated);
};

exports.deleteUser = (req, res) => {
    const deleted = userModel.remove(Number(req.params.id));
    if (!deleted) return res.status(404).send('User not found');
    res.sendStatus(204);
};