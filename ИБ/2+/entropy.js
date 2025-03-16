const fs = require("fs");
const path = require("path");
const XLSXChart = require("xlsx-chart");

const TURKISH_ALPHABET = "abcçdefgğhıijklmnoöprsştuüvyz";
const RUSSIAN_ALPHABET = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
const BINARY_ALPHABET = "10";

const xlsxChart = new XLSXChart();

const calculateSymbolsFrequency = (file, alphabet) => {
    let contents = fs.readFileSync(file, { encoding: "utf-8" });
    let resultFrequency = {};
    let symbolsCount = 0;
    if (alphabet === BINARY_ALPHABET) {
        contents = convertStringToBinary(contents);
    }
    else {
        contents = contents.toLowerCase();
    }
    for (let symbol of contents) {
        if (alphabet.includes(symbol)) {
            resultFrequency[symbol] = (resultFrequency[symbol] || 0) + 1;
            symbolsCount++;
        }
    }
    for (let key in resultFrequency) {
        resultFrequency[key] = resultFrequency[key] / symbolsCount;
    }
    return { symbolsCount, resultFrequency };
};

const exportHistogram = async (file, frequency, alphabet) => {
    const opts = {
        chart: "column",
        titles: ["Частота"],
        fields: alphabet,
        data: { "Частота": frequency },
        chartTitle: "Частота появления символов в алфавите"
    };
    return new Promise((resolve, reject) => {
        xlsxChart.generate(opts, (err, data) => {
            if (err) {
                reject(err);
            } else {
                fs.writeFileSync(path.join(__dirname, "charts", file), data);
                console.log(`Гистограмма сохранена: ${file}`);
                resolve();
            }
        });
    });
};

const convertStringToBinary = (str) => {
    return str.split("").map((char) => char.charCodeAt(0).toString(2)).join("");
};

const calculateEntropy = (frequency) => {
    let entropy = 0;
    for (let key in frequency) {
        entropy += frequency[key] * Math.log2(frequency[key]);
    }
    return -entropy;
};

const calculateInformationCount = (message, alphabetEntropy) => {
    return message.length * alphabetEntropy;
};

const calculateEffectiveEntropy = (entropy, p) => {
    const q = 1 - p;
    let conditionalEntropy = -p * Math.log2(p) - q * Math.log2(q);
    return entropy - (Number.isNaN(conditionalEntropy) ? 0 : conditionalEntropy);
};

module.exports = {
    TURKISH_ALPHABET,
    RUSSIAN_ALPHABET,
    BINARY_ALPHABET,
    calculateSymbolsFrequency,
    calculateEntropy,
    convertStringToBinary,
    calculateInformationCount,
    calculateEffectiveEntropy,
    exportHistogram
};