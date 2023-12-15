const data = document.body.innerText
  .trim()
  .split("\n")
  .filter((str) => str !== "");

const LRInstructions = data[0]
  .split("")
  .filter((str) => str !== " ")
  .map((str) => (str === "L" ? 0 : 1));

const navMaps = data
  .slice(1)
  .map((str) => [...str.matchAll(/[A-Z]{3}/g)].map((arr) => arr[0]));

const navObj = {};

navMaps.forEach((arr) => {
  navObj[arr[0]] = arr.slice(1);
});

function followMap(start, num) {
  while (start.slice(-1) !== "Z") {
    start = navObj[start][LRInstructions[num % LRInstructions.length]];
    num += 1;
  }
  return num;
}

const startData = navMaps
  .map((arr) => arr[0])
  .filter((str) => str.slice(-1) === "A");

function leastCommonMultiple(num1, num2) {
  function gcd(num1, num2) {
    return !num2 ? num1 : gcd(num2, num1 % num2);
  }

  return (num1 * num2) / gcd(num1, num2);
}

startData
  .map((str) => followMap(str, 0))
  .reduce((acc, num) => leastCommonMultiple(acc, num));
