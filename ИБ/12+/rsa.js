const crypto = require('crypto');
const bigInt = require('big-integer');
const { generateCoprimeNumber, generatePrimeNumber } = require('./mathUtils');

class RSA {
    static getRSA() {
        if (!this.rsa)
            this.rsa = new RSA();
        return this.rsa;
    }

    constructor() {
        this.p = generatePrimeNumber(100);
        this.q = generatePrimeNumber(100);
        this.n = this.p.multiply(this.q);
        this.fi = this.p.subtract(1).multiply(this.q.subtract(1));
        this.e = generateCoprimeNumber(this.fi);
        this.d = this.e.modInv(this.fi);
    }

    getPublicKey() {
        return { e: this.e, n: this.n };
    }

    createDigitalSignature(text) {
        const hash = crypto.createHash('sha256').update(text, 'utf8').digest();
        return bigInt(hash.readBigInt64LE()).modPow(this.d, this.n);
    }

    verifyDigitalSignature(text, digitalSign, e, n) {
        const signBytes = digitalSign.modPow(e, n);
        const receivedHash = crypto.createHash('sha256').update(text, 'utf8').digest();
        return bigInt(receivedHash.readBigInt64LE()).eq(signBytes);
    }
}

module.exports = { RSA };