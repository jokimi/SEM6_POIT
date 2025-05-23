const express = require('express');
const app = express();
const path = require('path');

app.use('/', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/26-02.html'));
});

app.listen(3000);