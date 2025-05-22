const crypto = require('crypto');

class CryptoService {
    static rsaEncrypt(data, publicKey) {
        const buffer = Buffer.from(data);
        const encryptedData = crypto.publicEncrypt(publicKey, buffer);
        return encryptedData.toString('base64');
    }

    static rsaDecrypt(data, privateKey) {
        const buffer = Buffer.from(data, 'base64');
        const decryptedData = crypto.privateDecrypt(privateKey, buffer);
        return decryptedData.toString('utf-8');
    }

    static exponentiation(a, b, n) {
        let tmp = a;
        let sum = tmp;
        for (let i = 1; i < b; i++) {
            for (let j = 1; j < a; j++) {
                sum += tmp;
                if (sum >= n) {
                    sum -= n;
                }
            }
            tmp = sum;
        }
        return tmp;
    }

    static multiplication(a, b, n) {
        let sum = 0;
        for (let i = 0; i < b; i++) {
            sum += a;
            if (sum >= n) {
                sum -= n;
            }
        }
        return sum;
    }

    static encryptElGamal(p, g, x, originalString) {
        let result = "";
        const y = this.exponentiation(g, x, p);
        for (const char of originalString) {
            const code = char.charCodeAt(0);
            if (code > 0) {
                const k = Math.floor(Math.random() * (p - 2)) + 1;
                const a = this.exponentiation(g, k, p);
                const b = this.multiplication(this.exponentiation(y, k, p), code, p);
                result += `${a} ${b} `;
            }
        }
        return result;
    }

    static decryptElGamal(p, x, encryptedText) {
        let result = "";
        const arr = encryptedText.split(' ').filter(xx => xx !== "");
        for (let i = 0; i < arr.length; i += 2) {
            const a = parseInt(arr[i]);
            const b = parseInt(arr[i + 1]);
            if (a !== 0 && b !== 0) {
                const deM = this.multiplication(b, this.exponentiation(a, p - 1 - x, p), p);
                const m = String.fromCharCode(deM);
                result += m;
            }
        }
        return result;
    }
}

module.exports = CryptoService;