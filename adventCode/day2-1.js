const maxArray = [12, 13, 14];

const gameValues = document.body.innerText
  .split("\n")
  .slice(0, 100)
  .map((str) => str.replace(/Game \d+: /, "").split("; "))
  .map((arr) => arr.map((str) => gameStrToNumArray(str)));

function gameStrToNumArray(str) {
  const colors = ["red", "green", "blue"];
  return colors.map((color) => {
    const match = str.match(new RegExp(`(\\d+) ${color}`));
    return match ? parseInt(match[1]) : 0;
  });
}

function testGame(arr) {
  return arr.every((round) =>
    round.every((count, index) => count <= maxArray[index])
  );
}

const result = gameValues.reduce(
  (acc, curr, index) => (testGame(curr) ? acc + index + 1 : acc),
  0
);

console.log(result);
