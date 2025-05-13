const express = require('express');
const { generateRSA, RC4encrypt } = require('./stream-cipher');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get("/", (req, res) => res.redirect('/rsa'));
app.get("/rsa", (req, res) => res.render('rsa'));
app.get("/rc4", (req, res) => res.render('rc4'));

app.post("/rsa", (req, res) => {
    try {
        const { length } = req.body;
        const result = generateRSA(256, parseInt(length));
        res.json(result);
    } catch (err) {
        console.error("Ошибка генерации RSA:", err);
        res.status(500).send("Ошибка при генерации RSA");
    }
});

app.post("/rc4", (req, res) => {
    const text = req.body.text;
    const { result, generationTime } = RC4encrypt(text);
    const decrypted = RC4encrypt(result).result;
    res.status(200).json({ result, decrypted, generationTime });
});

app.listen(3000, () => console.log("Server is running at http://localhost:3000"));