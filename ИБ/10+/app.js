const express = require('express');
const CryptoService = require('./cryptoService');
const fs = require("fs");
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/rsa');
})

app.get('/rsa', (req, res) => {
    res.render('rsa', {
        originalText: '',
        publicKey: fs.readFileSync('./keys/public.pem', 'utf8'),
        privateKey: fs.readFileSync('./keys/private.pem', 'utf8'),
        encryptionTime: 0,
        decryptionTime: 0,
        encryptedData: '',
        decryptedData: ''
    });
});

app.post('/rsa', (req, res) => {
    const originalText = req.body.message || "Kozeka Elizaveta Maksimovna";
    const publicKey = fs.readFileSync('./keys/public.pem', 'utf8');
    const privateKey = fs.readFileSync('./keys/private.pem', 'utf8');

    let startTime = performance.now();
    const encryptedData = CryptoService.rsaEncrypt(originalText, publicKey);
    let endTime = performance.now();
    const encryptionTime = endTime - startTime;

    startTime = performance.now();
    const decryptedData = CryptoService.rsaDecrypt(encryptedData, privateKey);
    endTime = performance.now();
    const decryptionTime = endTime - startTime;

    res.render('rsa', {
        originalText,
        publicKey,
        privateKey,
        encryptionTime,
        decryptionTime,
        encryptedData,
        decryptedData
    });
});

app.get('/el-gamal', (req, res) => {
    res.render('el-gamal', {
        originalText: '',
        encryptionTime: 0,
        decryptionTime: 0,
        encryptedData: '',
        decryptedData: ''
    });
});

app.post('/el-gamal', (req, res) => {
    const p = 241;
    const g = 56;
    const x = 9;
    const originalText = req.body.message || "Kozeka Elizaveta Maksimovna";
    
    let startTime = performance.now();
    const encryptedData = CryptoService.encryptElGamal(p, g, x, originalText);
    let endTime = performance.now();
    const encryptionTime = endTime - startTime;

    startTime = performance.now();
    const decryptedData = CryptoService.decryptElGamal(p, x, encryptedData);
    endTime = performance.now();
    const decryptionTime = endTime - startTime;

    res.render('el-gamal', {
        originalText,
        encryptionTime,
        decryptionTime,
        encryptedData,
        decryptedData
    });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});