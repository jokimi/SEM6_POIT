const bigInt = require('big-integer');

const generateRandomNumber = (n) => {
    const randomBits = [];
    for (let i = 0; i < n; i++) {
        const bit = Math.random() < 0.5 ? '0' : '1';
        randomBits.push(bit);
    }
    const randomString = randomBits.join('');
    return BigInt('0b' + randomString);
};

const gcd = (a, b) => {
    while (!b.isZero()) {
        const temp = b;
        b = a.mod(b);
        a = temp;
    }
    return a;
};

const getInverseNumber = (number, modulus) => {
    let m0 = modulus;
    let y = bigInt.zero;
    let x = bigInt.one;
    if (modulus.eq(1)) {
        return bigInt.zero;
    }
    while (number.gt(1)) {
        let quotient = number.divmod(modulus).quotient;
        let temp = modulus;
        modulus = number.divmod(modulus).remainder;
        number = temp;
        temp = y;
        y = x.minus(quotient.times(y));
        x = temp;
    }
    if (x.lt(0)) {
        x = x.plus(m0);
    }
    return x;
};

const generateCoprime = (n) => {
    const min = n.plus(1);
    const max = n.times(2);
    let coprime;
    do {
        coprime = bigInt.randBetween(min, max);
    } while (!gcd(n, coprime).eq(1));
    return coprime;
};

module.exports = {
    generateRandomNumber,
    gcd,
    getInverseNumber,
    generateCoprime
};