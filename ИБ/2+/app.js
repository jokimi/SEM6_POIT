const express = require("express");
const path = require("path");

const {
    TURKISH_ALPHABET,
    RUSSIAN_ALPHABET,
    BINARY_ALPHABET,
    calculateSymbolsFrequency,
    calculateEntropy,
    convertStringToBinary,
    calculateInformationCount,
    calculateEffectiveEntropy,
    exportHistogram
} = require("./entropy");

const app = express();
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
    try {
        let result = calculateSymbolsFrequency(path.join(__dirname, "files", "turkish.txt"), TURKISH_ALPHABET);
        await exportHistogram("turkish.xlsx", result.resultFrequency, TURKISH_ALPHABET);
        let entropy = calculateEntropy(result.resultFrequency);
        const turkish = { entropy: entropy.toFixed(2), symbolsCount: result.symbolsCount };

        result = calculateSymbolsFrequency(path.join(__dirname, "files", "russian.txt"), RUSSIAN_ALPHABET);
        await exportHistogram("russian.xlsx", result.resultFrequency, RUSSIAN_ALPHABET);
        entropy = calculateEntropy(result.resultFrequency);
        const russian = { entropy: entropy.toFixed(2), symbolsCount: result.symbolsCount };

        result = calculateSymbolsFrequency(path.join(__dirname, "files", "turkish.txt"), BINARY_ALPHABET);
        entropy = calculateEntropy(result.resultFrequency);
        const binaryTur = { entropy: entropy.toFixed(2), symbolsCount: result.symbolsCount };

        result = calculateSymbolsFrequency(path.join(__dirname, "files", "russian.txt"), BINARY_ALPHABET);
        entropy = calculateEntropy(result.resultFrequency);
        const binaryRus = { entropy: entropy.toFixed(2), symbolsCount: result.symbolsCount };

        const informationCountTurkish = calculateInformationCount("Kozeka Elizaveta Maksimovna", +turkish.entropy).toFixed(2);
        const informationCountRussian = calculateInformationCount("Козека Елизавета Максимовна", +russian.entropy).toFixed(2);

        let messageTur = convertStringToBinary("Kozeka Elizaveta Maksimovna");
        const informationCountBinaryTur = calculateInformationCount(messageTur, +binaryTur.entropy).toFixed(2);

        let messageRus = convertStringToBinary("Kozeka Elizaveta Maksimovna");
        const informationCountBinaryRus = calculateInformationCount(messageRus, +binaryRus.entropy).toFixed(2);

        let effectiveEntropyCase1 = calculateEffectiveEntropy(binaryTur.entropy, 0.1);
        let effectiveEntropyCase2 = calculateEffectiveEntropy(binaryTur.entropy, 0.5);
        let effectiveEntropyCase3 = calculateEffectiveEntropy(binaryTur.entropy, 1);

        const entropyWithError = {
            effectiveEntropyCase1: effectiveEntropyCase1.toFixed(2),
            effectiveEntropyCase2: effectiveEntropyCase2,
            effectiveEntropyCase3: effectiveEntropyCase3,
            informationCountCase1: calculateInformationCount(messageTur, effectiveEntropyCase1).toFixed(2),
            informationCountCase2: calculateInformationCount(messageTur, effectiveEntropyCase2).toFixed(2),
            informationCountCase3: calculateInformationCount(messageTur, effectiveEntropyCase3).toFixed(2)
        };
        
        res.render("lab2", {
            turkish,
            russian,
            binaryTur,
            binaryRus,
            informationCountTurkish,
            informationCountRussian,
            informationCountBinaryTur,
            informationCountBinaryRus,
            entropyWithError
        });
    } catch (error) {
        console.error("Ошибка:", error);
        res.status(500).send("Ошибка сервера");
    }
});

app.listen(3000, () => console.log("Сервер запущен на http://localhost:3000"));