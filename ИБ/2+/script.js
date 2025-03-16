// Функции для расчета энтропии и информации
function textReader(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        callback(e.target.result.toLowerCase());
    };
    reader.readAsText(file);
}

function lettersDict(text) {
    const lettersDict = {};
    for (let char of text) {
        if (char.match(/[a-zа-яё0-9]/i)) {
            lettersDict[char] = (lettersDict[char] || 0) + 1;
        }
    }
    return lettersDict;
}

function probs(text) {
    const letterDict = lettersDict(text);
    const lettersProbs = {};
    const total = Object.values(letterDict).reduce((sum, count) => sum + count, 0);
    for (let char in letterDict) {
        lettersProbs[char] = letterDict[char] / total;
    }
    return lettersProbs;
}

function entropy(text) {
    let entropy = 0;
    const letterProbs = probs(text);
    for (let prob of Object.values(letterProbs)) {
        entropy -= prob * Math.log2(prob);
    }
    return entropy;
}

function convertToBinary(text) {
    let binaryText = '';
    for (let char of text) {
        const binaryChar = char.charCodeAt(0).toString(2).padStart(8, '0'); // для 1 байта
        binaryText += binaryChar;
    }
    return binaryText;
}

function binaryEntropy(text) {
    const binaryText = convertToBinary(text);
    return entropy(binaryText);
}

function convertToAscii(text) {
    let asciiText = '';
    for (let char of text) {
        if (char.match(/[a-zа-яё]/i)) {
            asciiText += char.charCodeAt(0).toString(2);
        }
    }
    return asciiText;
}

function quantityOfInformation(entropy, text) {
    return entropy * text.length;
}

function mistakeQuantity(prob, text, entropy) {
    return text.length * (entropy - (-prob * Math.log2(prob) - (1 - prob) * Math.log2(1 - prob)));
}

function mistakeQuantityAscii(prob, text, entropy) {
    // Преобразуем текст в ASCII и рассчитываем количество информации с ошибками для ASCII
    const asciiText = convertToAscii(text);
    return mistakeQuantity(prob, asciiText, entropy);
}

// Функция для рисования гистограммы
function drawChart(data, elementId) {
    const ctx = document.getElementById(elementId).getContext('2d');
    const labels = Object.keys(data);
    const values = Object.values(data);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Количество символов',
                data: values,
                backgroundColor: 'rgba(0, 123, 255, 0.6)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Функция для расчета всех данных
function calculate() {
    const fioLatText = document.getElementById('fioLatInput').value;
    const fioKirText = document.getElementById('fioKirInput').value;
    const latFile = document.getElementById('fileInputLat').files[0];
    const kirFile = document.getElementById('fileInputKir').files[0];

    if (latFile && kirFile) {
        // Рассчитываем энтропию для латиницы
        textReader(latFile, function(text) {
            const latEntropy = entropy(text);
            document.getElementById('latEntropy').innerText = latEntropy.toFixed(4);
            const latBinaryEntropy = binaryEntropy(text);
            document.getElementById('latBinaryEntropy').innerText = latBinaryEntropy.toFixed(4);

            // Рисуем гистограмму для латиницы (с количеством символов)
            const latLetterDict = lettersDict(text);
            drawChart(latLetterDict, 'latChart');

            // Рассчитываем информацию для ФИО на латинице
            const latInfo = quantityOfInformation(latEntropy, fioLatText);
            document.getElementById('infoLat').innerText = latInfo.toFixed(4);

            // Рассчитываем информацию с ошибками для латиницы
            document.getElementById('error0.1-l').innerText = mistakeQuantity(0.1, fioLatText, latEntropy).toFixed(4);
            document.getElementById('error0.5-l').innerText = mistakeQuantity(0.5, fioLatText, latEntropy).toFixed(4);
            document.getElementById('error1.0-l').innerText = mistakeQuantity(0.999, fioLatText, latEntropy).toFixed(4);

            document.getElementById('error0.1-a').innerText = mistakeQuantityAscii(0.1, fioLatText, latEntropy).toFixed(4);
            document.getElementById('error0.5-a').innerText = mistakeQuantityAscii(0.5, fioLatText, latEntropy).toFixed(4);
            document.getElementById('error1.0-a').innerText = mistakeQuantityAscii(0.999, fioLatText, latEntropy).toFixed(4);

            const latBinaryText = convertToAscii(text);
            const binInfo = quantityOfInformation(latBinaryEntropy, latBinaryText);
            document.getElementById('infoAscii').innerText = binInfo.toFixed(4);
        });

        // Рассчитываем энтропию для кириллицы
        textReader(kirFile, function(text) {
            const kirEntropy = entropy(text);
            document.getElementById('kirEntropy').innerText = kirEntropy.toFixed(4);
            const kirBinaryEntropy = binaryEntropy(text);
            document.getElementById('kirBinaryEntropy').innerText = kirBinaryEntropy.toFixed(4);

            // Рисуем гистограмму для кириллицы (с количеством символов)
            const kirLetterDict = lettersDict(text);
            drawChart(kirLetterDict, 'kirChart');

            // Рассчитываем информацию для ФИО на кириллице
            const kirInfo = quantityOfInformation(kirEntropy, fioKirText);
            document.getElementById('infoKir').innerText = kirInfo.toFixed(4);

            // Рассчитываем информацию с ошибками для кириллицы
            document.getElementById('error0.1-k').innerText = mistakeQuantity(0.1, fioKirText, kirEntropy).toFixed(4);
            document.getElementById('error0.5-k').innerText = mistakeQuantity(0.5, fioKirText, kirEntropy).toFixed(4);
            document.getElementById('error1.0-k').innerText = mistakeQuantity(0.999, fioKirText, kirEntropy).toFixed(4);
        });
    } else {
        alert('Пожалуйста, загрузите файлы с текстами!');
    }
}