function Sum(a, b) {
    return a + b;
}

function Sub(a, b) {
    return a - b;
}

function Mul(a, b) {
    return a * b;
}

function Div(a, b) {
    return a / b;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sum").innerHTML = Sum(7, 3);
    document.getElementById("sub").innerHTML = Sub(7, 3);
    document.getElementById("mul").innerHTML = Mul(7, 3);
    document.getElementById("div").innerHTML = Div(7, 3).toFixed(2);
});