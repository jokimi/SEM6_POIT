const base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const base64Encode = (s) => {
    let r = "";
    let p = "";
    let c = s.length % 3;
    if (c > 0) {
        for (; c < 3; c++) {
            p += '=';
            s += "\0";
        }
    }
    for (c = 0; c < s.length; c += 3) {
        if (c > 0 && (c / 3 * 4) % 76 == 0) {
            r += "\r\n";
        }
        let n = (s.charCodeAt(c) << 16) + (s.charCodeAt(c + 1) << 8) + s.charCodeAt(c + 2);
        let chars = [(n >>> 18) & 63, (n >>> 12) & 63, (n >>> 6) & 63, n & 63];
        r += base64chars[chars[0]] + base64chars[chars[1]] + base64chars[chars[2]] + base64chars[chars[3]];
    }
    return r.substring(0, r.length - p.length) + p;
};

const convertBase64ToBinary = (base64String) => {
    let binaryString = "";
    for (let i = 0; i < base64String.length; i++) {
        let base64Char = base64String[i];
        if (base64Char === "=") {
            binaryString += '0'.repeat(6);
        }
        else {
            let index = base64chars.indexOf(base64Char);
            let charBinary = index.toString(2);
            charBinary = charBinary.length < 6 ? charBinary.padStart(6, '0') : charBinary;
            binaryString += charBinary;
        }
    }
    return binaryString;
};

const convertBinaryToBase64String = (binaryString) => {
    let text = convertBinaryToString(binaryString).replace(/\x00/g, '');
    return base64Encode(text);
};

const convertBinaryToString = (binaryString) => {
    let text = '';
    for (let i = 0; i < binaryString.length; i += 8) {
        const byte = binaryString.slice(i, i + 8);
        const charCode = parseInt(byte, 2);
        const char = String.fromCharCode(charCode);
        text += char;
    }
    return text;
};

module.exports = {
    base64Encode,
    convertBase64ToBinary,
    convertBinaryToBase64String,
    convertBinaryToString
};