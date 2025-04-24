const express = require('express');
const app = express();
const routerTable = require('./routes/routerTable');

app.use(express.json());
routerTable(app);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});