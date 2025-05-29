const bigInt = require('big-integer');

function generatePrimeNumber(bitLength) {
    let primeCandidate;
    do {
        primeCandidate = bigInt.randBetween(
            bigInt(2).pow(bitLength - 1),
            bigInt(2).pow(bitLength)
        );
    } while (!primeCandidate.isPrime());

    return primeCandidate;
}

function generateCoprimeNumber(fi) {
    const min = fi.plus(1);
    const max = fi.times(2);
    let coprime;

    do {
        coprime = bigInt.randBetween(min, max);
    } while (!isCoprime(fi, coprime));

    return coprime;
}

function isCoprime(a, b) {
    return bigInt.gcd(a, b).eq(1);
}

module.exports = {
    generatePrimeNumber,
    generateCoprimeNumber,
    isCoprime
};