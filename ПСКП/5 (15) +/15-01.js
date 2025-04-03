const { MongoClient } = require('mongodb');
const { ServerApiVersion } = require('mongodb');
const http = require('http');
const URL = require('url');
const { GetHandler } = require('./handlers');
const { PostHandler } = require('./handlers');
const { PutHandler } = require('./handlers');
const { DeleteHandler } = require('./handlers');

const uri = "mongodb://localhost:27017/replicaSet=rs&readPreference=primary&serverSelectionTimeoutMS=5000&connectTimeoutMS=10000";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const dbName = 'bstu';
const facultyCollectionName = 'faculty';
const pulpitCollectionName = 'pulpit';

client.connect().then(r => {
    console.log('Connected successfully!')
}).catch(err => {
    console.log(err)
});

const db = client.db(dbName);
const faculty = db.collection(facultyCollectionName);
const pulpit = db.collection(pulpitCollectionName);

http.createServer((req, res) => {
    let url = decodeURI(req.url);
    let method = req.method;
    console.log(req.method + ' ' + url);
    switch (method) {
        case 'GET':
            GetHandler(url, res,faculty, pulpit);
            break;
        case 'POST':
            PostHandler(url, req, res, faculty, pulpit, client);
            break;
        case 'PUT':
            PutHandler(url, req, res, faculty, pulpit);
            break;
        case 'DELETE':
            DeleteHandler(url, res, faculty, pulpit);
            break;
        default:
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
    }
}).listen(5000, () => {
    console.log('http://localhost:5000');
});