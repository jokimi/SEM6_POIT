const express = require('express');
const { RSA } = require('./rsa');
const { ElGamal } = require('./elGamal');
const bigInt = require('big-integer');
const { Schnorr } = require('./schnorr');

const app = express();
app.use(express.json());
const PORT = 3000;

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/rsa');
});

app.get('/rsa', (req, res) => {
    res.render('rsa');
});

app.post('/rsa/sign', (req, res) => {
    const originalText = req.body.message;
    const rsa = RSA.getRSA();
    const publicKey = rsa.getPublicKey();

    let startTime = performance.now();
    const digitalSign = rsa.createDigitalSignature(originalText);
    let endTime = performance.now();
    const signTime = endTime - startTime;

    res.json({
        signTime: signTime.toFixed(3),
        publicKey,
        digitalSign
    });
});

app.post('/rsa/verify', (req, res) => {
    const originalText = req.body.message;
    const e = bigInt(req.body.e);
    const n = bigInt(req.body.n);
    const digitalSign = bigInt(req.body.sign);
    const rsa = RSA.getRSA();

    let startTime = performance.now();
    const verified = rsa.verifyDigitalSignature(originalText, digitalSign, e, n);
    let endTime = performance.now();
    const verificationTime = endTime - startTime;

    res.json({
        verificationTime: verificationTime.toFixed(3),
        verified
    });
});

app.get('/elGamal', (req, res) => {
    res.render('elGamal');
});

app.post('/elGamal/sign', (req, res) => {
    const originalText = req.body.message;

    let startTime = performance.now();
    const elGamal = ElGamal.getElGamal();
    const publicKey = elGamal.getPublicKey();

    const digitalSign = elGamal.createDigitalSignature(originalText);
    let endTime = performance.now();
    const signTime = endTime - startTime;

    res.json({
        signTime: signTime.toFixed(3),
        publicKey,
        digitalSign
    });
});

app.post('/elGamal/verify', (req, res) => {
    const originalText = req.body.message;
    const p = bigInt(req.body.p);
    const g = bigInt(req.body.g);
    const y = bigInt(req.body.y);
    const digitalSignA = bigInt(req.body.signA);
    const digitalSignB = bigInt(req.body.signB);
    const elGamal = ElGamal.getElGamal();

    let startTime = performance.now();
    const verified = elGamal.verifyDigitalSignature(originalText, [digitalSignA, digitalSignB], p, g, y);
    let endTime = performance.now();
    const verificationTime = endTime - startTime;

    res.json({
        verificationTime: verificationTime.toFixed(3),
        verified
    });
});

app.get('/schnorr', (req, res) => {
    res.render('schnorr');
});

app.post('/schnorr/sign', (req, res) => {
    const originalText = req.body.message;

    let startTime = performance.now();
    const schnorr = Schnorr.getSchnorr();
    const publicKey = schnorr.getPublicKey();

    const digitalSign = schnorr.generateDigitalSignature(originalText);
    let endTime = performance.now();
    const signTime = endTime - startTime;

    res.json({
        signTime: signTime.toFixed(3),
        publicKey,
        digitalSign
    });
});

app.post('/schnorr/verify', (req, res) => {
    const originalText = req.body.message;
    const p = bigInt(req.body.p);
    const g = bigInt(req.body.g);
    const q = bigInt(req.body.q);
    const y = bigInt(req.body.y);
    const digitalSignH = bigInt(req.body.signH);
    const digitalSignB = bigInt(req.body.signB);
    const schnorr = Schnorr.getSchnorr();

    let startTime = performance.now();
    const verified = schnorr.verifyDigitalSignature(originalText, [digitalSignH, digitalSignB], p, g, q, y);
    let endTime = performance.now();
    const verificationTime = endTime - startTime;

    res.json({
        verificationTime: verificationTime.toFixed(3),
        verified
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});