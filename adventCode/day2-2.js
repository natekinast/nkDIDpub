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

function getMaxArray(gameArray) {
  const maxArray = [0, 0, 0];
  return maxArray.map((_, index) =>
    gameArray.reduce((acc, curr) => Math.max(acc, curr[index]), 0)
  );
}

const result = gameValues
  .map((arr) => getMaxArray(arr))
  .reduce((acc, curr) => acc + curr.reduce((acc, curr) => acc * curr, 1), 0);

console.log(result);
