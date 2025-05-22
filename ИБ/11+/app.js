const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.json());

app.get('/', (req, res) => {
    res.redirect('/sha256');
});

app.get('/sha256', (req, res) => {
    res.render('sha256');
});

app.get('/md5', (req, res) => {
    res.render('md5');
});

app.post('/sha256', (req, res) => {
    const message = req.body.message;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    let startTime = performance.now();
    const hash = crypto.createHash('sha256').update(message).digest('hex');
    let endTime = performance.now();
    const hashingTime = endTime - startTime;
    const length = hash.length / 2;
    res.json({ hash, length, hashingTime });
});

app.post('/md5', (req, res) => {
    const message = req.body.message;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    let startTime = performance.now();
    const hash = crypto.createHash('md5').update(message).digest('hex');
    let endTime = performance.now();
    const hashingTime = endTime - startTime;
    const length = hash.length / 2;
    res.json({ hash, length, hashingTime });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});