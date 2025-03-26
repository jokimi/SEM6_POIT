const express = require("express");
const { gcd, isPrime, primeFactors, sieveOfEratosthenes } = require("./numbersTheory");

const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    return res.redirect("/gcd");
});

app.get("/gcd", async (req, res) => {
    res.render('gcd');
});

app.get("/primes", async (req, res) => {
    const n = 703;
    const m = 667;
    const numberOfPrimes = (n / Math.log(n)).toFixed(3);
    const primesFrom2to703 = sieveOfEratosthenes(2, n);
    const primesFrom667to703 = sieveOfEratosthenes(m, n);
    const isConcatenationPrime = isPrime(Number(`${m}${n}`));
    const factorsOfM = primeFactors(m);
    const factorsOfN = primeFactors(n);
    res.render('primes', {
        n: n, m: m,
        numberOfPrimes: numberOfPrimes,
        primesFrom2to703: primesFrom2to703.join(", "),
        resultNumberOfPrimes: primesFrom2to703.length,
        primesFrom667to703: primesFrom667to703.join(", "),
        isConcatenationPrime: isConcatenationPrime,
        factorsOfM: factorsOfM,
        factorsOfN: factorsOfN,
    });
});

app.post("/gcd", async (req, res) => {
    try {
        let a = Number(req.body.a);
        let b = Number(req.body.b);
        let c = req.body.c ? Number(req.body.c) : null;
        let resultC = c === null ? "" : `, ${c}`;
        const result = `НОД(${a}, ${b}${resultC}) = ${gcd(a, b, c)}`;
        return res.status(200).json({ result: result });
    }
    catch (err) {
        return res.status(422).send("Произошла ошибка: " + err.message);
    }
});

app.listen(5000, () => console.log('Server is running at http://localhost:5000'));