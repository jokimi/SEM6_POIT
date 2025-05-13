const express = require('express');
const path = require('path');
const {decrypt, Encoding, encrypt, generatePrivateKey, generatePublicKey, getPublicKeyParams} = require('./asymmetric');
const bigInt = require('big-integer');
const {generateRandomNumber} = require('./mathUtils');
const {base64Encode, convertBinaryToBase64String} = require('./base64');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/ascii');
});

app.get("/ascii", (req, res) => {
    res.render('asymmetric-ascii', { message: null }); // ничего не шифруем, просто отрисовываем форму
});

app.post("/ascii", (req, res) => {
    const message = req.body.message;
    const firstSequenceElement = generateRandomNumber(100);
    const privateKeyASCII = generatePrivateKey(bigInt(firstSequenceElement), 8);
    const {a, n} = getPublicKeyParams(privateKeyASCII);
    const publicKey = generatePublicKey(privateKeyASCII, a, n);

    let startTime = performance.now();
    const encrypted = encrypt(publicKey, message, Encoding.ASCII);
    let endTime = performance.now();
    const encodingTime = (endTime - startTime).toFixed(4);

    startTime = performance.now();
    const decrypted = decrypt(privateKeyASCII, encrypted, a, n);
    endTime = performance.now();
    const decodingTime = (endTime - startTime).toFixed(4);

    const decoder = new TextDecoder('utf-8');
    const decodedString = decoder.decode(decrypted.decoded);

    res.render('asymmetric-ascii', {
        message: message,
        originalText: message,
        privateKey: privateKeyASCII.join(', '),
        n: n,
        a: a,
        publicKey: publicKey.join(', '),
        encrypted: encrypted.join(', '),
        decrypted: decodedString,
        encodingTime: encodingTime,
        decodingTime: decodingTime
    });
});

app.get("/base64", (req, res) => {
    res.render('asymmetric-base64', { message: null });
});

app.post("/base64", (req, res) => {
    const message = req.body.message;
    const originalBase64 = base64Encode(message);
    const firstSequenceElement = generateRandomNumber(100);
    const privateKeyBase64 = generatePrivateKey(bigInt(firstSequenceElement), 6);
    const {a, n} = getPublicKeyParams(privateKeyBase64);
    const publicKey = generatePublicKey(privateKeyBase64, a, n);

    let startTime = performance.now();
    const encrypted = encrypt(publicKey, message, Encoding.BASE64);
    let endTime = performance.now();
    const encodingTime = (endTime - startTime).toFixed(4);

    startTime = performance.now();
    const decrypted = decrypt(privateKeyBase64, encrypted, a, n);
    endTime = performance.now();
    const decodingTime = (endTime - startTime).toFixed(4);
    const decodedString = convertBinaryToBase64String(decrypted.binary);

    res.render('asymmetric-base64', {
        message: message,
        originalText: originalBase64,
        privateKey: privateKeyBase64.join(', '),
        n: n,
        a: a,
        publicKey: publicKey.join(', '),
        encrypted: encrypted.join(', '),
        decrypted: decodedString,
        encodingTime: encodingTime,
        decodingTime: decodingTime
    });
});

app.listen(3000, () => console.log(`Server is running at http://localhost:3000`));