const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

const TOKEN = 'y0_AgAAAABj_wh0AAzVdwAAAAEZyKBqAABni95F1jVKsrv-lN9YTc1FHRBsiw';
const BASE_URL = 'https://cloud-api.yandex.net/v1/disk';

axios.defaults.headers.common['Authorization'] = `OAuth ${TOKEN}`;

async function createFolder(folderName) {
    const url = `${BASE_URL}/resources?path=${encodeURIComponent(folderName)}`;
    return axios.put(url);
}

async function deleteResource(remotePath) {
    const url = `${BASE_URL}/resources?path=${encodeURIComponent(remotePath)}&permanently=true`;
    return axios.delete(url);
}

async function uploadFile(localPath, remotePath) {
    const { data } = await axios.get(`${BASE_URL}/resources/upload`, {
        params: { path: remotePath, overwrite: true }
    });
    const stream = fs.createReadStream(localPath);
    return axios.put(data.href, stream);
}

async function copyFile(sourcePath, destinationPath) {
    const url = `${BASE_URL}/resources/copy?from=${encodeURIComponent(sourcePath)}&path=${encodeURIComponent(destinationPath)}&overwrite=true`;
    return axios.post(url);
}

async function moveFile(sourcePath, destinationPath) {
    const url = `${BASE_URL}/resources/move?from=${encodeURIComponent(sourcePath)}&path=${encodeURIComponent(destinationPath)}&overwrite=true`;
    return axios.post(url);
}

app.post('/md/:name', async (req, res) => {
    try {
        await createFolder(req.params.name);
        res.sendStatus(201);
    }
    catch (err) {
        res.sendStatus(408);
    }
});

app.post('/rd/:name', async (req, res) => {
    try {
        await deleteResource(req.params.name);
        res.sendStatus(200);
    }
    catch (err) {
        res.sendStatus(408);
    }
});

app.post('/up/:name', upload.single('file'), async (req, res) => {
    try {
        const localPath = req.file.path;
        const remotePath = req.params.name;
        await uploadFile(localPath, remotePath);
        fs.unlinkSync(localPath);
        res.sendStatus(200);
    }
    catch (err) {
        res.sendStatus(408);
    }
});

const downloadsDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
}

app.post('/down/:name', async (req, res) => {
    try {
        const remotePath = req.params.name;
        const url = `${BASE_URL}/resources/download?path=${encodeURIComponent(remotePath)}`;
        const { data } = await axios.get(url);
        const response = await axios.get(data.href, { responseType: 'stream' });
        const localFilePath = path.join(downloadsDir, remotePath);
        const writer = fs.createWriteStream(localFilePath);
        response.data.pipe(writer);
        writer.on('finish', () => {
            res.sendStatus(200);
        });
        writer.on('error', (error) => {
            res.sendStatus(408);
        });
    }
    catch (err) {
        console.error(err.response ? err.response.data : err.message);
        res.sendStatus(404);
    }
});

app.post('/del/:name', async (req, res) => {
    try {
        await deleteResource(req.params.name);
        res.sendStatus(200);
    }
    catch (err) {
        res.sendStatus(404);
    }
});

app.post('/copy/:from/:to', async (req, res) => {
    try {
        await copyFile(req.params.from, req.params.to);
        res.sendStatus(200);
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            res.sendStatus(404);
        }
        else {
            res.sendStatus(408);
        }
    }
});

app.post('/move/:from/:to', async (req, res) => {
    try {
        await moveFile(req.params.from, req.params.to);
        res.sendStatus(200);
    }
    catch (err) {
        if (err.code === 'ENOENT') {
            res.sendStatus(404);
        }
        else {
            res.sendStatus(408);
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});