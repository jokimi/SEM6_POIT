const express = require('express');
const fs = require('fs');
const app = express();

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'qwe'
});

const port = 3000;
const users = JSON.parse(fs.readFileSync('users.json'));

app.use(session);
app.use(passport.initialize());

passport.use(new BasicStrategy((login, password, done) => {
    console.log(`\npassport.use: login = ${login}, password = ${password}`);
    let rc = null;
    let credentials = getCredentials(login);
    if (!credentials) {
        rc = done(null, false, { message: 'Incorrect login' });
        console.log(`denied: login = ${login}, password = ${password}`);
    }
    else if (!verifyPassword(credentials.password, password)) {
        rc = done(null, false, { message: 'Incorrect password' });
        console.log(`incorrect: login = ${login}, password = ${password}`);
    }
    else {
        rc = done(null, login);
    }
    return rc;
}));

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res, next) => {
    if (req.session.logout) {
        req.session.logout = false;
        delete req.headers['authorization'];
    }
    next();
}, passport.authenticate('basic', { session: false }), (req, res) => {
    res.redirect('/resource');
});

app.get('/logout', (req, res) => {
    req.session.logout = true;
    res.redirect('/login');
});

app.get('/resource', (req, res) => {
    if (req.headers['authorization'])
        res.send('Очень секретная информация!');
    else
        res.redirect('/login');
});

app.get('*', (req, res) => {
    res.status(404).send('[ERROR] 404: Not Found');
});

const getCredentials = login => {
    console.log('login', login);
    console.log('found', users.find(u => u.login.toUpperCase() === login.toUpperCase()));
    return users.find(u => u.login.toUpperCase() === login.toUpperCase());
};

const verifyPassword = (firstPassword, secondPassword) => firstPassword === secondPassword;

app.listen(process.env.PORT || port, () => console.log(`Server running at http://localhost:${port}/\n`));