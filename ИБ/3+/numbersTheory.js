const gcd = (a, b, c = null) => {
    if (c === null) {
        let q = a % b;
        if (q === 0) {
            return b;
        }
        return gcd(b, q);
    }
    else {
        let gcdAB = gcd(a, b);
        return gcd(gcdAB, c);
    }
};

const sieveOfEratosthenes = (m, n) => {
    let arr = Array.from({ length: (n - m + 1) }, (value, index) => m + index);
    let square = Math.round(Math.sqrt(n));
    let primes = [];
    for (let i = 2; i <= square; i++) {
        if (isPrime(i)) {
            primes.push(i);
        }
    }
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        let isPrime = true;
        for (let j = 0; j < primes.length; j++) {
            if (primes[j] * primes[j] > arr[i])
                break;
            if (arr[i] % primes[j] === 0) {
                isPrime = false;
                break;
            }
        }
        if (isPrime && arr[i] > 1)
            result.push(arr[i]);
    }
    return result;
};

const primeFactors = (n) => {
    const factors = [];
    let divisor = 2;
    while (n >= 2) {
        if (n % divisor === 0) {
            factors.push(divisor);
            n /= divisor;
        }
        else {
            divisor++;
        }
    }
    return factors.join(' * ');
};

const isPrime = (a) => {
    if (a < 2)
        return false;
    let square = Math.round(Math.sqrt(a));
    for (let i = 2; i <= square; i++) {
        if (a % i === 0)
            return false;
    }
    return true;
};

module.exports = { gcd, sieveOfEratosthenes, primeFactors, isPrime };