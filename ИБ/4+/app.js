const express = require("express");
const fs = require("fs");
const path = require("path");
const { performance } = require('perf_hooks');
const {
    ENGLISH_ALPHABET,
    caesarDecode,
    caesarEncode,
    calculateSymbolsFrequency,
    exportHistogram,
    formCaesarAlphabet,
    formTrithemiusTable,
    trithemiusDecode,
    trithemiusEncode
} = require("./cipher");
const CAESAR_KEYWORD = "kozeka";
const TRITHEMIUS_KEYWORD = "liza";
const shift = 24;

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    return res.redirect("/caesar");
});

app.get("/caesar", async (req, res) => {
    const alphabet = formCaesarAlphabet(CAESAR_KEYWORD, ENGLISH_ALPHABET, shift);
    const originalFilePath = path.join(__dirname, "files", "english.txt");
    const caesarFilePath = path.join(__dirname, "files", "english_caesar.txt");

    let text = fs.readFileSync(originalFilePath, { encoding: "utf-8" });
    let originalFrequency = calculateSymbolsFrequency(originalFilePath, ENGLISH_ALPHABET);
    await exportHistogram('english.xlsx', originalFrequency.resultFrequency, ENGLISH_ALPHABET);

    let startTime = performance.now();
    let caesarText = caesarEncode(text, alphabet);
    let endTime = performance.now();
    const encodingTime = (endTime - startTime).toFixed(4);

    fs.writeFileSync(caesarFilePath, caesarText, { encoding: 'utf8' });
    let caesarFrequency = calculateSymbolsFrequency(caesarFilePath, ENGLISH_ALPHABET);
    await exportHistogram('caesar.xlsx', caesarFrequency.resultFrequency, ENGLISH_ALPHABET);

    startTime = performance.now();
    let originalText = caesarDecode(caesarText, alphabet);
    endTime = performance.now();
    const decodingTime = (endTime - startTime).toFixed(4);

    res.render('caesar', {
        alphabet: alphabet,
        caesarText: caesarText,
        encodingTime: encodingTime,
        originalText: originalText,
        decodingTime: decodingTime
    });
});

app.get('/trithemius', async (req, res) => {
    const trtable = formTrithemiusTable(2, 13);
    const originalFilePath = path.join(__dirname, "files", "english.txt");
    const trithemiusFilePath = path.join(__dirname, "files", "english_trithemius.txt");

    let text = fs.readFileSync(originalFilePath, { encoding: "utf-8" });
    let originalFrequency = calculateSymbolsFrequency(originalFilePath, ENGLISH_ALPHABET);
    await exportHistogram('english.xlsx', originalFrequency.resultFrequency, ENGLISH_ALPHABET);

    let startTime = performance.now();
    let trithemiusText = trithemiusEncode(text, trtable);
    let endTime = performance.now();
    const encodingTime = (endTime - startTime).toFixed(4);

    fs.writeFileSync(trithemiusFilePath, trithemiusText, { encoding: 'utf8' });
    let trithemiusFrequency = calculateSymbolsFrequency(trithemiusFilePath, ENGLISH_ALPHABET);
    await exportHistogram('trithemius.xlsx', trithemiusFrequency.resultFrequency, ENGLISH_ALPHABET);

    startTime = performance.now();
    let originalText = trithemiusDecode(trithemiusText, trtable);
    endTime = performance.now();
    const decodingTime = (endTime - startTime).toFixed(4);

    res.render('trithemius', {
        table: trtable,
        trithemiusText: trithemiusText,
        encodingTime: encodingTime,
        originalText: originalText,
        decodingTime: decodingTime
    });
});

app.listen(5000, () => console.log('Server is running at http://localhost:5000'));