const URL = require("url");

const WriteToJson = (r, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(r));
}

const WriteError = (err, res) => {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(err));
}

const GetHandler =  (url, res,faculty,pulpit) => {
    let pathParts = url.split('/');
    const parsedUrl = URL.parse(url);
    switch (true) {
        case url === '/api/faculties' || url === '/api/faculties/' :
            faculty.find().toArray().then(r => {
                WriteToJson(r, res)
            }).catch(err => {
                WriteError(err, res)
            });
            break;
        case (url === '/api/pulpits' || url === '/api/pulpits/') :
            pulpit.find().toArray().then(r => {
                WriteToJson(r, res)
            }).catch(err => {
                WriteError(err, res)
            });
            break;
        default :
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
    }
}

const PostHandler = (url, req, res, faculty, pulpit, client) => {
    let body = '';
    switch (true) {
        case url === '/api/faculties' || url === '/api/faculties/' :
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let facultyToInsert = JSON.parse(body);
                faculty.insertOne(facultyToInsert).then(r =>
                    WriteToJson(facultyToInsert, res)
                ).catch(err => {
                    WriteError(err, res);
                });
            });
            break;
        case url === '/api/pulpits' || url === '/api/pulpits/' :
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let pulpitToInsert = JSON.parse(body);
                
                // Проверка существования факультета перед добавлением кафедры
                faculty.findOne({ FACULTY: pulpitToInsert.faculty }).then(existingFaculty => {
                    if (!existingFaculty) {
                        // Если факультет не найден, возвращаем ошибку 400
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Факультет не существует' }));
                    } else {
                        // Если факультет существует, добавляем кафедру
                        pulpit.insertOne(pulpitToInsert).then(r => {
                            WriteToJson(pulpitToInsert, res);
                        }).catch(err => {
                            WriteError(err, res);
                        });
                    }
                }).catch(err => {
                    WriteError(err, res);
                });
            });
            break;
        default :
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
    }
}

const PutHandler = (url, req, res,faculty,pulpit) => {
    let pathParts = url.split('/');
    const parsedUrl = URL.parse(url);
    let body = '';
    switch (true) {
        case url === '/api/faculties' || url === '/api/faculties/' :
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let facultyToInsert = JSON.parse(body);
                faculty.findOneAndUpdate({FACULTY: facultyToInsert.FACULTY}, {$set: facultyToInsert}).then(r => {
                    WriteToJson(r.value, res)
                }).catch(err => {
                    WriteError(err, res);
                });
            });
            break;
        case url === '/api/pulpits' || url === '/api/pulpits/' :
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let pulpitToInsert = JSON.parse(body);
                pulpit.findOneAndUpdate({
                    pulpit: pulpitToInsert.pulpit,
                }, {$set: pulpitToInsert},).then(r => {
                    WriteToJson(r.value, res)
                }).catch(err => {
                    WriteError(err, res);
                });
            });
            break;
        default :
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
    }
}

const DeleteHandler = (url, res,faculty,pulpit) => {
    let pathParts = url.split('/');
    const parsedUrl = URL.parse(url);
    switch (true) {
        case pathParts[1] + '/' + pathParts[2] === 'api/faculties' && pathParts[3] !== undefined :
            faculty.findOneAndDelete({FACULTY: pathParts[3]}).then(r => {
                WriteToJson(r, res)
            }).catch(err => {
                WriteError(err, res)
            });
            break;
        case pathParts[1] + '/' + pathParts[2] === 'api/pulpits' && pathParts[3]!== undefined :
            pulpit.findOneAndDelete({pulpit: pathParts[3]}).then(r => {
                WriteToJson(r, res)
            }).catch(err => {
                WriteError(err, res)
            });
            break;
        default :
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not found');
    }
}

module.exports = {
    GetHandler,
    PostHandler,
    PutHandler,
    DeleteHandler,
    WriteToJson,
    WriteError
};