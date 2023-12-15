const data = document.body.innerText
  .trim()
  .split("\n")
  .map((str) => str.split(""));

function findEmptyCols(data) {
  return data[0].map((val, index) =>
    data.every((line) => line[index] === ".") ? 1 : 0
  );
}
function findEmptyRows(data) {
  return data.map((arr) => (arr.every((str) => str === ".") ? 1 : 0));
}
let emptyCols = findEmptyCols(data).flatMap((val, index) =>
  val === 1 ? [index] : []
);

let emptyRows = findEmptyRows(data).flatMap((val, index) =>
  val === 1 ? [index] : []
);

const dataColExp = data.map((arr, index) =>
  arr.flatMap((str, index) => {
    if (emptyCols.includes(index)) {
      emptyCols = emptyCols.map((val) => val + 1);
      return ["*", "*"];
    }
    return ["*"];
  })
);
