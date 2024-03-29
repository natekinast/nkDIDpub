function getDiffArr(arr) {
  const returnArr = [];
  arr.forEach((num, index) => {
    if (index !== 0) {
      returnArr.push(num - arr[index - 1]);
    }
  });
  return returnArr;
}

function getNextVal(arr) {
  const diffArrs = [arr];
  while (!arr.every((num) => num === 0)) {
    arr = getDiffArr(arr);
    diffArrs.push(arr);
  }
  return diffArrs.reduce((acc, arr) => acc + arr[arr.length - 1], 0);
}

const data = document.body.innerText
  .trim()
  .split("\n")
  .map((str) => str.split(" "))
  .map((arr) => arr.map((str) => parseInt(str)));

const result = data.reduce((acc, arr) => acc + getNextVal(arr), 0);
console.log(result);