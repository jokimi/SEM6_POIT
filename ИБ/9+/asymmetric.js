const bigInt = require('big-integer');
const { generateCoprime, getInverseNumber } = require('./mathUtils');
const { base64Encode, convertBase64ToBinary } = require('./base64');

const Encoding = {
    ASCII: 0,
    BASE64: 1
};

const generatePrivateKey = (initialNumber, z) => {
    const sequence = [];
    let element = initialNumber;
    let sum = initialNumber;
    for (let i = 0; i < z; i++) {
        sequence.push(element);
        element = sum.add(bigInt(z));
        sum = sum.add(element);
    }
    return sequence;
};

const getPublicKeyParams = (privateKey) => {
    const sum = privateKey.reduce((prev, curr) => prev.plus(curr));
    const n = bigInt(sum).add(1n);
    const a = generateCoprime(n);
    return {a, n};
};

const generatePublicKey = (privateKey, a, n) => {
    const sequence = [];
    let d;
    let e;
    for (let i = 0; i < privateKey.length; i++) {
        d = privateKey[i];
        e = d.multiply(a).mod(n);
        sequence.push(e);
    }
    return sequence;
};

const encrypt = (publicKey, plaintext, encoding) => {
    const encryptedList = [];
    if (encoding === Encoding.BASE64) {
        plaintext = base64Encode(plaintext);
    }
    plaintext.split('').forEach((b, index) => {
        let binaryString;
        if (encoding === Encoding.ASCII) {
            binaryString = plaintext.charCodeAt(index).toString(2).padStart(8, '0');
        }
        else {
            binaryString = convertBase64ToBinary(plaintext[index]);
        }
        const positions = [];
        for (let i = 0; i < binaryString.length; i++) {
            if (binaryString[i] === '1') {
                positions.push(i);
            }
        }
        let sum = bigInt.zero;
        positions.forEach(position => {
            if (position < publicKey.length) {
                sum = sum.add(publicKey[position]);
            }
        });
        encryptedList.push(sum);
    });
    return encryptedList;
};

const decrypt = (privateKey, encryptedText, a, n) => {
    let decryptedBytes = [];
    let binaryResult = "";
    let inverse = getInverseNumber(a, n);
    for (let cipher of encryptedText) {
        let decryptedValue = cipher.times(inverse).mod(n);
        let binaryString = getDecryptedBinary(decryptedValue, privateKey);
        binaryResult += binaryString;
        let decryptedByte = parseInt(binaryString, 2);
        decryptedBytes.push(decryptedByte);
    }
    return { decoded: new Uint8Array(decryptedBytes), binary: binaryResult };
};

const getDecryptedBinary = (number, privateKey) => {
    let binaryString = '';
    for (let i = privateKey.length - 1; i >= 0; i--) {
        if (number.greaterOrEquals(privateKey[i])) {
            binaryString += '1';
            number = number.minus(privateKey[i]);
        }
        else {
            binaryString += '0';
        }
    }
    return binaryString.split('').reverse().join('');
};

module.exports = {
    Encoding,
    generatePrivateKey,
    getPublicKeyParams,
    generatePublicKey,
    encrypt,
    decrypt,
    getDecryptedBinary
};