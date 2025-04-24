const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const session = require('express-session');
const port = 4000;

const users = JSON.parse(fs.readFileSync('users.json'));

app.use(session({
    secret: 'secretkey123',
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

const authMiddleware = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
    const { login, password } = req.body;
    const user = users.find(u => u.login === login && u.password === password);
    if (user) {
        req.session.user = user.login;
        res.redirect('/resource');
    }
    else {
        res.send('<h3>Неверный логин или пароль. <a href="/login">Попробовать снова</a></h3>');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

app.get('/resource', authMiddleware, (req, res) => {
    res.send(`<h2>Привет, ${req.session.user}! Это секретный ресурс.</h2><a href="/logout">Выйти</a>`);
});

app.use((req, res) => {
    res.status(404).send('[ERROR] 404: Not Found');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});