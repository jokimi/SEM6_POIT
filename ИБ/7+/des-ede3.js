const forge = require('node-forge');

exports.encrypt = (msg, key) => {
    const cipher = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(key));
    cipher.start();
    cipher.update(forge.util.createBuffer(msg, 'utf8'));
    cipher.finish();
    return cipher.output.toHex();
};

exports.decrypt = (encryptedHex, key) => {
    const encryptedBytes = forge.util.hexToBytes(encryptedHex);
    const encryptedBuffer = forge.util.createBuffer(encryptedBytes);
    const decipher = forge.cipher.createDecipher('3DES-ECB', forge.util.createBuffer(key));
    decipher.start();
    decipher.update(encryptedBuffer);
    decipher.finish();
    return decipher.output.toString();
};

exports.avalancheEffect = (input, key) => {
    const originalEncrypted = exports.encrypt(input, key);
    const originalBinary = stringToBinary(input);
    const modifiedBinary = invertLastBit(originalBinary);
    const modifiedString = binaryToString(modifiedBinary);
    const modifiedEncrypted = exports.encrypt(modifiedString, key);
    const a = hexToBinary(originalEncrypted);
    const b = hexToBinary(modifiedEncrypted);
    let changes = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i])
            changes++;
    }
    const percent = ((changes / a.length) * 100).toFixed(2);
    return {
        original: input,
        modified: modifiedString,
        avalancheEffect: percent
    };
};

exports.stepByStepAvalancheEffect = (input, key) => {
    const bufferKey = forge.util.createBuffer(key);

    const originalBin = stringToBinary(input);
    const modifiedBin = invertLastBit(originalBin);
    const modified = binaryToString(modifiedBin);

    const desEncrypt = (text, keyPart) => {
        const cipher = forge.cipher.createCipher('DES-ECB', forge.util.createBuffer(keyPart));
        cipher.start();
        cipher.update(forge.util.createBuffer(text, 'utf8'));
        cipher.finish();
        return cipher.output.getBytes();
    };

    const desDecrypt = (bytes, keyPart) => {
        const decipher = forge.cipher.createDecipher('DES-ECB', forge.util.createBuffer(keyPart));
        decipher.start();
        decipher.update(forge.util.createBuffer(bytes));
        decipher.finish();
        return decipher.output.getBytes();
    };

    const key1 = key.subarray(0, 8);
    const key2 = key.subarray(8, 16);
    const key3 = key.subarray(16, 24);

    const originalStep1 = desEncrypt(input, key1);
    const modifiedStep1 = desEncrypt(modified, key1);
    const diff1 = countBitDiff(originalStep1, modifiedStep1);

    const originalStep2 = desDecrypt(originalStep1, key2);
    const modifiedStep2 = desDecrypt(modifiedStep1, key2);
    const diff2 = countBitDiff(originalStep2, modifiedStep2);

    const originalStep3 = desEncrypt(originalStep2, key3);
    const modifiedStep3 = desEncrypt(modifiedStep2, key3);
    const diff3 = countBitDiff(originalStep3, modifiedStep3);

    return {
        step1: `${diff1.percent}% (${diff1.changedBits} бит)`,
        step2: `${diff2.percent}% (${diff2.changedBits} бит)`,
        step3: `${diff3.percent}% (${diff3.changedBits} бит)`
    };
};

function countBitDiff(aBytes, bBytes) {
    let aHex = forge.util.bytesToHex(aBytes);
    let bHex = forge.util.bytesToHex(bBytes);

    let aBin = hexToBinary(aHex);
    let bBin = hexToBinary(bHex);

    let changed = 0;
    for (let i = 0; i < aBin.length; i++) {
        if (aBin[i] !== bBin[i]) changed++;
    }
    return {
        changedBits: changed,
        percent: ((changed / aBin.length) * 100).toFixed(2)
    };
}

function stringToBinary(str) {
    return str.split('')
        .map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');
}

function binaryToString(bin) {
    return bin.match(/.{1,8}/g)
        .map(byte => String.fromCharCode(parseInt(byte, 2)))
        .join('');
}

function invertLastBit(bin) {
    const last = bin.slice(-1);
    const flipped = last === '0' ? '1' : '0';
    return bin.slice(0, -1) + flipped;
}

function hexToBinary(hex) {
    return hex.split('')
        .map(h => parseInt(h, 16).toString(2).padStart(4, '0'))
        .join('');
}