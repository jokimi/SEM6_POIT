const express = require('express');
const fs = require('fs');
const app = express();

const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy;
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: 'qwe'
});

const port = 3000;
const users = JSON.parse(fs.readFileSync('users.json'));

app.use(session);
app.use(passport.initialize());
passport.use(new DigestStrategy({ qop: 'auth' }, (login, done) => {
    console.log(`\npassport.use: login = ${login}`);
    let rc = null;
    let credentials = getCredentials(login);
    if (!credentials) {
        rc = done(null, false);
        console.log(`denied: login = ${login}`);
    }
    else
        rc = done(null, credentials.login, credentials.password);
    return rc;
}, (params, done) => {
    console.log('params: ', params);
    done(null, true);
}));

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res, next) => {
    if (req.session.logout) {
        req.session.logout = false;
        delete req.headers['authorization'];
    }
    next();
})
.get(
    '/login',
    passport.authenticate('digest', { session: false }),
    (req, res) => { res.redirect('/resource'); }
);

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
    console.log('login', login)
    console.log('found', users.find(u => u.login.toUpperCase() == login.toUpperCase()))
    return users.find(u => u.login.toUpperCase() == login.toUpperCase());
}

app.listen(process.env.PORT || port, () => console.log(`Server running at localhost:${port}/\n`));