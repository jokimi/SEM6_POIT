const express = require("express");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const app = express();
const PORT = 5000;
const STUDENT_FILE = path.join(__dirname, "/files/studentList.json");
const BACKUP_DIR = path.join(__dirname, "backups");

if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

const wss = new WebSocket.Server({ port: 4000 });
let clients = new Set();

wss.on("connection", (ws) => {
    clients.add(ws);
    console.log("Новый клиент подписался на уведомления");
    ws.on("close", () => clients.delete(ws));
});

const notifyClients = (message) => {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
};

const readStudents = () => {
    try {
        return JSON.parse(fs.readFileSync(STUDENT_FILE, "utf8"));
    } catch (err) {
        return { error: 1, message: `Ошибка чтения файла ${STUDENT_FILE}` };
    }
};

const writeStudents = (data) => {
    fs.writeFileSync(STUDENT_FILE, JSON.stringify(data, null, 2), "utf8");
};

app.post("/backup", (req, res) => {
    setTimeout(() => {
        const date = new Date(Date.now());
const timestamp = `${date.getFullYear()}${date.getDate().toString().padStart(2, '0')}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getHours().toString().padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
        const backupPath = path.join(BACKUP_DIR, `${timestamp}_StudentList.json`);
        fs.copyFile(STUDENT_FILE, backupPath, (err) => {
            if (err) {
                return res.json({ error: 1, message: "Ошибка создания резервной копии" });
            }
            notifyClients({ message: "Создана новая резервная копия", file: backupPath });
            res.json({ message: "Резервная копия создана", file: backupPath });
        });
    }, 2000);
});

const unlinkFile = (file) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path.join(BACKUP_DIR, file), (err) => {
            if (err) {
                console.error(`Ошибка удаления файла ${file}:`, err);
                reject(err);
            } else {
                notifyClients({ message: `Удалена резервная копия ${file}` });
                resolve();
            }
        });
    });
};

app.delete("/backup/:date", async (req, res) => {
    const targetDate = req.params.date;
    const targetDateFormatted = targetDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
    fs.readdir(BACKUP_DIR, async (err, files) => {
        if (err) {
            return res.json({ error: 1, message: "Ошибка чтения директории резервных копий" });
        }
        try {
            for (const file of files) {
                const fileDate = file.split("_")[0];
                if (fileDate < targetDate) {
                    await unlinkFile(file);
                }
            }
            res.json({ message: "Удаление завершено" });
        } catch (error) {
            res.json({ error: 1, message: `Ошибка при удалении файлов: ${error.message}` });
        }
    });
});

app.get("/backup", (req, res) => {
    fs.readdir(BACKUP_DIR, (err, files) => {
        if (err) return res.json({ error: 1, message: "Ошибка чтения директории резервных копий" });
        res.json(files);
    });
});

app.get("/", (req, res) => {
    const students = readStudents();
    res.json(students);
});

app.get("/:id", (req, res) => {
    const students = readStudents();
    const student = students.find(s => s.id === parseInt(req.params.id));
    student ? res.json(student) : res.json({ error: 2, message: `Студент с id ${req.params.id} не найден` });
});

app.post("/", express.json(), (req, res) => {
    let students = readStudents();
    const newStudent = req.body;
    if (students.find(s => s.id === newStudent.id)) {
        return res.json({ error: 3, message: `Студент с id ${newStudent.id} уже есть` });
    }
    students.push(newStudent);
    writeStudents(students);
    res.json(newStudent);
});

app.put("/", express.json(), (req, res) => {
    let students = readStudents();
    const updatedStudent = req.body;
    const index = students.findIndex(s => s.id === updatedStudent.id);
    if (index === -1) {
        return res.json({ error: 2, message: `Студент с id ${updatedStudent.id} не найден` });
    }
    students[index] = updatedStudent;
    writeStudents(students);
    res.json(updatedStudent);
});

app.delete("/:id", (req, res) => {
    let students = readStudents();
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) {
        return res.json({ error: 2, message: `Студент с id ${req.params.id} не найден` });
    }
    const deletedStudent = students.splice(index, 1);
    writeStudents(students);
    res.json(deletedStudent);
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));