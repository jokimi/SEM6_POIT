const crypto = require('crypto');

function generatePrime(bits) {
    while (true) {
        const bytes = crypto.randomBytes(bits / 8);
        let p = BigInt('0x' + bytes.toString('hex')) | 1n;
        if (isProbablePrime(p))
            return p;
    }
}

function isProbablePrime(n, k = 5) {
    if (n < 2n)
        return false;
    if (n === 2n || n === 3n)
        return true;
    if (n % 2n === 0n)
        return false;
    let s = 0n;
    let d = n - 1n;
    while (d % 2n === 0n) {
        d /= 2n;
        s += 1n;
    }
    WitnessLoop:
    for (let i = 0; i < k; i++) {
        const a = 2n + BigInt(Math.floor(Math.random() * Number(n - 4n)));
        let x = modPow(a, d, n);
        if (x === 1n || x === n - 1n)
            continue;
        for (let r = 1n; r < s; r++) {
            x = modPow(x, 2n, n);
            if (x === 1n)
                return false;
            if (x === n - 1n)
                continue WitnessLoop;
        }
        return false;
    }
    return true;
}

function modPow(base, exp, mod) {
    let result = 1n;
    base = base % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n)
            result = (result * base) % mod;
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}

function gcd(a, b) {
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
}

function generateRSA(bits, length) {
    const p = generatePrime(bits);
    const q = generatePrime(bits);
    const n = p * q;
    const phi = (p - 1n) * (q - 1n);
    let e;
    do {
        e = generatePrime(bits);
    } while (e >= phi || gcd(e, phi) !== 1n);
    let x = BigInt('0x' + crypto.randomBytes(bits / 8).toString('hex'));
    let x0 = x;
    const bitsArr = [];
    for (let i = 0; i < length; i++) {
        x = modPow(x, e, n);
        bitsArr.push((x & 1n) === 1n ? '1' : '0');
    }
    return {
        bitString: bitsArr.join(''),
        decimalValue: BigInt('0b' + bitsArr.join('')).toString(),
        params: {
            x0: x0.toString(),
            p: p.toString(),
            q: q.toString(),
            n: n.toString(),
            e: e.toString(),
            x: x.toString()
        }
    };
}

function RC4encrypt(data) {
    const n = 6;
    const key = [20, 21, 22, 23, 60, 61];
    const m = Math.pow(2, n);
    let x = 0;
    let y;
    const box = [...Array(m).keys()];
    const startTime = performance.now();
    for (let i = 0; i < m; i++) {
        x = (x + box[i] + key[i % key.length]) % m;
        [box[i], box[x]] = [box[x], box[i]];
    }
    const endTime = performance.now();
    const generationTime = (endTime - startTime).toFixed(4);
    x = y = 0;
    const out = [];
    for (const char of data) {
        x = (x + 1) % m;
        y = (y + box[x]) % m;
        [box[x], box[y]] = [box[y], box[x]];
        const k = box[(box[x] + box[y]) % m];
        out.push(String.fromCharCode(char.charCodeAt(0) ^ k));
    }
    return {
        result: out.join(''),
        generationTime
    };
}

module.exports = {
    RC4encrypt,
    generateRSA
};