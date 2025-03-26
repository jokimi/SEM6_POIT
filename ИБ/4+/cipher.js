const fs = require("fs");
const path = require("path");
const XLSXChart = require("xlsx-chart");

const ENGLISH_ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const TRITHEMIUS_KEYWORD = "liza";
const xlsxChart = new XLSXChart();

const caesarEncode = (text, cipherAlphabet) => {
    let resultCipher = "";
    text = text.toLowerCase();
    for (let i = 0; i < text.length; i++) {
        const currentChar = text[i];
        if (ENGLISH_ALPHABET.includes(currentChar)) {
            let originalIndex = ENGLISH_ALPHABET.indexOf(currentChar);
            resultCipher += cipherAlphabet[originalIndex];
        }
        else {
            resultCipher += currentChar;
        }
    }
    return resultCipher;
};

const caesarDecode = (text, cipherAlphabet) => {
    let originalText = "";
    for (let i = 0; i < text.length; i++) {
        const currentChar = text[i];
        if (cipherAlphabet.includes(currentChar)) {
            let originalIndex = cipherAlphabet.indexOf(currentChar);
            originalText += ENGLISH_ALPHABET[originalIndex];
        }
        else {
            originalText += currentChar;
        }
    }
    return originalText;
};

const formCaesarAlphabet = (keyword, alphabet, shift) => {
    let uniqueKeyword = [...new Set(keyword)].join('');
    let filteredAlphabet = alphabet.split('').filter(letter => !uniqueKeyword.includes(letter)).join('');
    let insertPart = uniqueKeyword.slice(0, alphabet.length - shift);
    let overflowPart = uniqueKeyword.slice(alphabet.length - shift);
    let resultAlphabet =
        overflowPart +                       // Остаток ключа, который не влез
        filteredAlphabet.slice(0, shift) +   // Символы до позиции вставки
        insertPart +                         // Вставленный ключ
        filteredAlphabet.slice(shift);       // Остаток алфавита
    return resultAlphabet;
};

const trithemiusEncode = (text, trithemiusTable) => {
    let result = "";
    text = text.toLowerCase();
    for (let i = 0; i < text.length; i++) {
        if (ENGLISH_ALPHABET.includes(text[i])) {
            let currentIndex = getIndexOfK(trithemiusTable, text[i]);
            if (currentIndex[0] === -1) {
                result += text[i];
                continue;
            }
            let newRow = (currentIndex[0] + 1) % trithemiusTable.length;
            result += trithemiusTable[newRow][currentIndex[1]];
        } else {
            result += text[i];
        }
    }
    return result;
};

const trithemiusDecode = (text, trithemiusTable) => {
    let originalText = "";
    for (let i = 0; i < text.length; i++) {
        let currentIndex = getIndexOfK(trithemiusTable, text[i]);
        if (currentIndex[0] === -1) {
            originalText += text[i];
            continue;
        }
        let newRow = currentIndex[0] - 1;
        if (newRow < 0) {
            newRow = trithemiusTable.length - 1;
        }
        if (trithemiusTable[newRow][currentIndex[1]]) {
            originalText += trithemiusTable[newRow][currentIndex[1]];
        }
        else {
            console.error(`Ошибка: индекс [${newRow}, ${currentIndex[1]}] выходит за границы!`);
            originalText += text[i];
        }
    }

    return originalText;
};

const getIndexOfK = (arr, k) => {
    for (let i = 0; i < arr.length; i++) {
        let index = arr[i].indexOf(k);
        if (index > -1) {
            return [i, index];
        }
    }
    return [-1, -1];
};

const formTrithemiusTable = (k, m) => {
    let resultTable = [];
    let keyword = TRITHEMIUS_KEYWORD.split('');
    let alphabet = ENGLISH_ALPHABET.split('');
    for (let i = 0; i < k; i++) {
        let row = [];
        for (let j = 0; j < m; j++) {
            if (keyword.length !== 0) {
                row.push(keyword.shift());
            }
            else {
                let symbol = alphabet.shift();
                while (TRITHEMIUS_KEYWORD.includes(symbol)) {
                    symbol = alphabet.shift();
                }
                row.push(symbol);
            }
        }
        resultTable.push(row);
    }
    return resultTable;
};

const calculateSymbolsFrequency = (file, alphabet) => {
    let contents = fs.readFileSync(file, { encoding: "utf-8" });
    contents = contents.toLowerCase();
    let resultFrequency = {};
    let symbolsCount = 0;
    for (let i = 0; i < contents.length; i++) {
        let symbol = contents[i];
        if (alphabet.includes(symbol)) {
            if (symbol in resultFrequency) {
                resultFrequency[symbol]++;
            }
            else {
                resultFrequency[symbol] = 1;
            }
            symbolsCount++;
        }
    }
    return { symbolsCount: symbolsCount, resultFrequency: resultFrequency };
};

const exportHistogram = async (file, frequency, alphabet) => {
    const opts = {
        chart: "column",
        titles: [
            "Частота"
        ],
        fields: alphabet,
        data: {
            "Частота": frequency
        },
        chartTitle: "Частота появления символов в алфавите"
    };
    await xlsxChart.generate(opts, (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            fs.writeFileSync(path.join(__dirname, 'charts', file), data);
            console.log("Chart created.");
        }
    });
};

module.exports = {
    caesarEncode,
    caesarDecode,
    formCaesarAlphabet,
    trithemiusEncode,
    trithemiusDecode,
    formTrithemiusTable,
    calculateSymbolsFrequency,
    exportHistogram,
    ENGLISH_ALPHABET
};