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

console.log(navObj);

function followMap(start, num) {
  while (start !== "ZZZ") {
    start = navObj[start][LRInstructions[num % LRInstructions.length]];
    num += 1;
  }

  return num;
}

followMap("AAA", 0);
