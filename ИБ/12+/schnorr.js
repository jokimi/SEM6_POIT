const crypto = require('crypto');
const bigInt = require('big-integer');

class Schnorr {
    static getSchnorr() {
        if (!this.schnorr)
            this.schnorr = new Schnorr();
        return this.schnorr;
    }

    constructor() {
        this.p = bigInt(48731);
        this.q = bigInt(443);
        this.g = bigInt(11444);
        do {
            this.x = bigInt.randBetween(1, this.q.subtract(1));
        } while (this.x.compare(this.q) >= 0);

        this.y = this.g.modPow(this.x, this.p).modInv(this.p);
    }

    getPublicKey() {
        return { p: this.p, q: this.q, g: this.g, y: this.y };
    }

    generateDigitalSignature(message) {
        let k;
        do {
            k = bigInt.randBetween(2, this.q.subtract(1));
        } while (!(k.compare(1) > 0 && k.compare(this.q) < 0));

        const a = this.g.modPow(k, this.p);
        message += a.toString();
        const hash = crypto.createHash('sha256').update(message, 'utf8').digest();
        return [
            bigInt(hash.readBigUInt64LE()),
            k.add(this.x.multiply(bigInt(hash.readBigUInt64LE()))).mod(this.q)
        ];
    }

    verifyDigitalSignature(message, digitalSignature, p, g, q, y) {
        let x = g.modPow(digitalSignature[1], p)
            .multiply(y.modPow(digitalSignature[0], p)).mod(p);
        message += x.toString();
        const receivedHash = crypto.createHash('sha256').update(message, 'utf8').digest();
        return digitalSignature[0].equals(receivedHash.readBigUInt64LE());
    }
}

module.exports = { Schnorr };