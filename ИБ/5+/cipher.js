const fs = require("fs");
const path = require("path");
const XLSXChart = require("xlsx-chart");

const ENGLISH_ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const NAME_KEYWORD = "liza";
const LASTNAME_KEYWORD = "kozeka";

const xlsxChart = new XLSXChart();

const routeTranspositionEncode = (text, tableSize) => {
    let table = formEncryptionTable(text, tableSize);
    let result = "";
    for (let col = 0; col < table[0].length; col++) {
        for (let row = 0; row < table.length; row++) {
            const zigzagRow = col % 2 === 0
                ? row
                : table.length - 1 - row;
            result += table[zigzagRow][col];
        }
    }
    return result;
}

const routeTranspositionDecode = (text, tableSize) => {
    let table = formDecryptionTable(text, tableSize);
    let result = "";
    let index = 0;
    for (let col = 0; col < table[0].length; col++) {
        for (let row = 0; row < table.length; row++) {
            const zigzagRow = col % 2 === 0
                ? row
                : table.length - 1 - row;
            if (index < text.length) {
                table[zigzagRow][col] = text[index];
                index++;
            }
        }
    }
    for (let row = 0; row < table.length; row++) {
        for (let col = 0; col < table[row].length; col++) {
            result += table[row][col];
        }
    }
    return result;
}

const formEncryptionTable = (text, tableSize) => {
    let cipherTable = [];
    let textIndex = 0;
    for (let i = 0; i < tableSize[0]; i++) {
        let row = [];
        for (let j = 0; j < tableSize[1]; j++) {
            let char = text[textIndex] !== undefined ? text[textIndex] : '';
            row.push(char);
            textIndex++;
        }
        cipherTable.push(row);
    }
    return cipherTable;
}

const formDecryptionTable = (text, tableSize) => {
    let cipherTable = [];
    for (let i = 0; i < tableSize[0]; i++) {
        let row = Array(tableSize[1]).fill('');
        cipherTable.push(row);
    }
    return cipherTable;
}

const formSortedTable = (tableSize, table) => {
    let sortedTable = [];
    const { nameKeywordIndexes, lastnameKeywordIndexes } = transformKeywords(tableSize);
    for (let i = 0; i < nameKeywordIndexes.length; i++) {
        sortedTable[nameKeywordIndexes[i][1]] = table[i];
    }
    table = structuredClone(sortedTable);
    for (let i = 0; i < nameKeywordIndexes.length; i++) {
        for (let j = 0; j < lastnameKeywordIndexes.length; j++) {
            sortedTable[i][lastnameKeywordIndexes[j][1]] = table[i][j];
        }
    }
    return sortedTable;
}

const multipleTranspositionEncode = (text, table) => {
    let result = "";
    for (let i = 0; i < table[0].length; i++) {
        for (let j = 0; j < table.length; j++) {
            result += table[j][i];
        }
    }
    return result;
}

const transformKeywords = (tableSize) => {
    let resultKeywordName = NAME_KEYWORD.repeat(Math.floor(tableSize[0] / NAME_KEYWORD.length));
    resultKeywordName += NAME_KEYWORD.substring(0, tableSize[0] % NAME_KEYWORD.length);
    let resultKeywordLastName = LASTNAME_KEYWORD.repeat(Math.floor(tableSize[1] / LASTNAME_KEYWORD.length));
    resultKeywordLastName += LASTNAME_KEYWORD.substring(0, tableSize[1] % LASTNAME_KEYWORD.length);
    let nameKeywordIndexes = indexLetters(resultKeywordName);
    let lastnameKeywordIndexes = indexLetters(resultKeywordLastName);
    return { nameKeywordIndexes, lastnameKeywordIndexes };
}

const multipleTranspositionDecode = (tableSize, table) => {
    let unsortedTable = [];
    let { nameKeywordIndexes, lastnameKeywordIndexes } = transformKeywords(tableSize);
    for (let i = 0; i < nameKeywordIndexes.length; i++) {
        unsortedTable[i] = [];
        for (let j = 0; j < lastnameKeywordIndexes.length; j++) {
            unsortedTable[i][j] = table[i][lastnameKeywordIndexes[j][1]];
        }
    }
    table = structuredClone(unsortedTable);
    for (let i = 0; i < nameKeywordIndexes.length; i++) {
        unsortedTable[i] = table[nameKeywordIndexes[i][1]];
    }
    let result = "";
    for (let i = 0; i < unsortedTable.length; i++) {
        for (let j = 0; j < unsortedTable[0].length; j++) {
            result += unsortedTable[i][j];
        }
    }
    return result;
}

const indexLetters = (str) => {
    str = str.toLowerCase();
    const indexes = [];
    let result = [];
    for (let i = 0; i < str.length; i++) {
        indexes[i] = [str[i], i];
    }
    indexes.sort((a, b) => a[0].localeCompare(b[0]));
    for (let i = 0; i < indexes.length; i++) {
        indexes[i][2] = i;
    }
    for (let i = 0; i < indexes.length; i++) {
        result[indexes[i][1]] = [str[indexes[i][1]], indexes[i][2]];
    }
    return result;
}

const factorizeNumber = (num) => {
    if (isPrime(num)) {
        num++;
    }
    let sqrt = Math.floor(Math.sqrt(num));
    for (let i = sqrt; i >= 1; i--) {
        if (num % i === 0) {
            return [i, num / i];
        }
    }
    return [1, num];
}

const isPrime = (a) => {
    if (a < 2)
        return false;
    let square = Math.round(Math.sqrt(a));
    for (let i = 2; i <= square; i++) {
        if (a % i === 0)
            return false;
    }
    return true;
}

const calculateSymbolsFrequency = (file, alphabet) => {
    let contents = fs.readFileSync(file, { encoding: "utf-8" });
    contents = contents.toLowerCase();
    let resultFrequency = {};
    let symbolsCount = 0;
    for (let i = 0; i < contents.length; i++) {
        let symbol = contents[i];
        if (symbol in resultFrequency) {
            resultFrequency[symbol]++;
        }
        else {
            resultFrequency[symbol] = 1;
        }
        symbolsCount++;
    }
    return { symbolsCount: symbolsCount, resultFrequency: resultFrequency };
}

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
}

const formatTableForDisplay = (table) => {
    let html = "<table class='table table-bordered'><thead><tr>";
    for (let i = 0; i < table[0].length; i++) {
        html += `<th>Column ${i + 1}</th>`;
    }
    html += "</tr></thead><tbody>";  
    for (let row of table) {
        html += "<tr>";
        for (let cell of row) {
            html += `<td>${cell}</td>`;
        }
        html += "</tr>";
    }
    html += "</tbody></table>";
    return html;
}

module.exports = {
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
};