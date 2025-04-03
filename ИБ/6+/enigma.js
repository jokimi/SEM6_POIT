const fs = require("fs");
const path = require("path");
const XLSXChart = require("xlsx-chart");

const xlsxChart = new XLSXChart();

const Operation = {
    ENCRYPT: 0,
    DECRYPT: 1,
};

class Enigma {
    constructor(lCurrentPosition = 0, mCurrentPosition = 0, rCurrentPosition = 0) {
        this.ALPHABET = "abcdefghijklmnopqrstuvwxyz";
        this.R_ROTOR = "nzjhgrcxmyswboufaivlpekqdt";
        this.M_ROTOR = "jpgvoumfyqbenhzrdkasxlictw";
        this.L_ROTOR = "vzbrgityupsdnhlxawmjqofeck";
        this.REFLECTOR = {
            a: 'r', b: 'd', c: 'o', d: 'b', e: 'j', f: 'n',
            g: 't', h: 'k', i: 'v', j: 'e', k: 'h', l: 'm',
            m: 'l', n: 'f', o: 'c', p: 'w', q: 'z', r: 'a',
            s: 'x', t: 'g', u: 'y', v: 'i', w: 'p', x: 's',
            y: 'u', z: 'q'
        };

        this.ROTOR_LENGTH = this.ALPHABET.length;
        this.L_SHIFT = 1;
        this.M_SHIFT = 2;
        this.R_SHIFT = 2;
        this.lCurrentPosition = lCurrentPosition;
        this.mCurrentPosition = mCurrentPosition;
        this.rCurrentPosition = rCurrentPosition;
    }

    encrypt(text) {
        let result = "";
        for (let s of text) {
            if (this.ALPHABET.includes(s)) {
                let afterDirect = this.directPath(s, Operation.ENCRYPT);
                let afterReflector = this.passThroughReflector(afterDirect);
                result += this.reversePath(afterReflector, Operation.ENCRYPT);
                this.shiftRotors();
            }
        }
        return result;
    }

    decrypt(encryptedText) {
        let result = "";
        for (let s of encryptedText) {
            if (this.ALPHABET.includes(s)) {
                let afterDirect = this.directPath(s, Operation.DECRYPT);
                let afterReflector = this.passThroughReflector(afterDirect);
                result += this.reversePath(afterReflector, Operation.DECRYPT);
                this.shiftRotors();
            }
        }
        return result;
    }

    directPath(letter, operation) {
        let afterRight;
        let afterMiddle;
        switch (operation) {
            case Operation.ENCRYPT:
                afterRight = this.rotorEncrypt(letter, this.ALPHABET, this.R_ROTOR, this.rCurrentPosition);
                afterMiddle = this.rotorEncrypt(afterRight, this.ALPHABET, this.M_ROTOR, this.mCurrentPosition);
                return this.rotorEncrypt(afterMiddle, this.ALPHABET, this.L_ROTOR, this.lCurrentPosition);
            case Operation.DECRYPT:
                afterRight = this.rotorDecrypt(letter, this.ALPHABET, this.R_ROTOR, this.rCurrentPosition);
                afterMiddle = this.rotorDecrypt(afterRight, this.ALPHABET, this.M_ROTOR, this.mCurrentPosition);
                return this.rotorDecrypt(afterMiddle, this.ALPHABET, this.L_ROTOR, this.lCurrentPosition);
        }
    }

    reversePath(letter, operation) {
        let afterLeft;
        let afterMiddle;
        switch (operation) {
            case Operation.ENCRYPT:
                afterLeft = this.rotorEncrypt(letter, this.L_ROTOR, this.ALPHABET, this.lCurrentPosition);
                afterMiddle = this.rotorEncrypt(afterLeft, this.M_ROTOR, this.ALPHABET, this.mCurrentPosition);
                return this.rotorEncrypt(afterMiddle, this.R_ROTOR, this.ALPHABET, this.rCurrentPosition);
            case Operation.DECRYPT:
                afterLeft = this.rotorDecrypt(letter, this.L_ROTOR, this.ALPHABET, this.lCurrentPosition);
                afterMiddle = this.rotorDecrypt(afterLeft, this.M_ROTOR, this.ALPHABET, this.mCurrentPosition);
                return this.rotorDecrypt(afterMiddle, this.R_ROTOR, this.ALPHABET, this.rCurrentPosition);
        }
    }

    shiftRotors() {
        this.lCurrentPosition = (this.lCurrentPosition + this.L_SHIFT) % this.ROTOR_LENGTH;
        this.mCurrentPosition = (this.mCurrentPosition + this.M_SHIFT) % this.ROTOR_LENGTH;
        this.rCurrentPosition = (this.rCurrentPosition + this.R_SHIFT) % this.ROTOR_LENGTH;
    }

    rotorEncrypt(letter, originalAlphabet, encryptionAlphabet, currentOffset) {
        const originalIndex = originalAlphabet.indexOf(letter);
        return encryptionAlphabet[(originalIndex + currentOffset) % this.ROTOR_LENGTH];
    }

    rotorDecrypt(letter, originalAlphabet, encryptionAlphabet, currentOffset) {
        const originalIndex = originalAlphabet.indexOf(letter);
        return encryptionAlphabet[(originalIndex - currentOffset + this.ROTOR_LENGTH) % this.ROTOR_LENGTH];
    }

    passThroughReflector(letter) {
        return this.REFLECTOR[letter];
    }
}

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
            } else {
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
        } else {
            fs.writeFileSync(path.join(__dirname, 'charts', file), data);
            console.log("Chart created.");
        }
    });
};

module.exports = {
    Enigma,
    calculateSymbolsFrequency,
    exportHistogram
};