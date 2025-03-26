const express = require('express');
const fs = require('fs');
const path = require('path');
const {
    ENGLISH_ALPHABET,
    calculateSymbolsFrequency,
    exportHistogram,
    factorizeNumber,
    formEncryptionTable,
    formSortedTable,
    multipleTranspositionDecode,
    multipleTranspositionEncode,
    routeTranspositionDecode,
    routeTranspositionEncode,
    formatTableForDisplay
} = require("./cipher");

const app = express();

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    return res.redirect("/transposition");
})

app.get('/transposition', async (req, res) => {
    const originalFilePath = path.join(__dirname, "files", "english.txt");
    const encodedFilePath = path.join(__dirname, "files", "english_transposition.txt");

    let text = fs.readFileSync(originalFilePath, { encoding: "utf-8" });
    text = text.toLowerCase();

    let originalFrequency = calculateSymbolsFrequency(originalFilePath, ENGLISH_ALPHABET);
    await exportHistogram('english.xlsx', originalFrequency.resultFrequency, ENGLISH_ALPHABET);

    let tableSize = factorizeNumber(text.length);
    
    // Формируем таблицу для шифрования
    let encryptionTable = formEncryptionTable(text, tableSize);
    let encodedTableHTML = formatTableForDisplay(encryptionTable);

    let startTime = performance.now();
    let encodedText = routeTranspositionEncode(text, tableSize);
    let endTime = performance.now();
    const encodingTime = (endTime - startTime).toFixed(4);

    fs.writeFileSync(encodedFilePath, encodedText, { encoding: 'utf8' });
    let encodedFrequency = calculateSymbolsFrequency(encodedFilePath, ENGLISH_ALPHABET);
    await exportHistogram('transposition.xlsx', encodedFrequency.resultFrequency, ENGLISH_ALPHABET);

    startTime = performance.now();
    let originalText = routeTranspositionDecode(encodedText, tableSize);
    endTime = performance.now();
    const decodingTime = (endTime - startTime).toFixed(4);

    res.render('routeTransposition', {
        encodedText: encodedText,
        encodingTime: encodingTime,
        originalText: originalText,
        decodingTime: decodingTime,
        encodedTableHTML: encodedTableHTML
    });
});

app.get('/multiple-transposition', async (req, res) => {
    const originalFilePath = path.join(__dirname, "files", "english.txt");
    const encodedFilePath = path.join(__dirname, "files", "english_multransposition.txt");

    let text = fs.readFileSync(originalFilePath, { encoding: "utf-8" });
    text = text.toLowerCase();

    let originalFrequency = calculateSymbolsFrequency(originalFilePath, ENGLISH_ALPHABET);
    await exportHistogram('english.xlsx', originalFrequency.resultFrequency, ENGLISH_ALPHABET);

    let tableSize = factorizeNumber(text.length);
    let table = formEncryptionTable(text, tableSize);

    let startTime = performance.now();
    let sorted = formSortedTable(tableSize, table);
    let encodedText = multipleTranspositionEncode(text, sorted);
    let endTime = performance.now();
    const encodingTime = (endTime - startTime).toFixed(4);

    fs.writeFileSync(encodedFilePath, encodedText, { encoding: 'utf8' });
    let encodedFrequency = calculateSymbolsFrequency(encodedFilePath, ENGLISH_ALPHABET);
    await exportHistogram('multransposition.xlsx', encodedFrequency.resultFrequency, ENGLISH_ALPHABET);

    startTime = performance.now();
    let originalText = multipleTranspositionDecode(tableSize, sorted);
    endTime = performance.now();
    const decodingTime = (endTime - startTime).toFixed(4);

    res.render('multipleTransposition', {
        encodedText: encodedText,
        encodingTime: encodingTime,
        originalText: originalText,
        decodingTime: decodingTime
    });
});

app.listen(5000, () => console.log('Server is running at http://localhost:5000'));