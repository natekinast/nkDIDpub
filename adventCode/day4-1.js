function calcScore(cardArray) {
  const winArray = cardArray.slice(0, 10);
  const numArray = cardArray.slice(10);
  return numArray.reduce((a, b) => {
    if (winArray.includes(b)) {
      return a === 0 ? 1 : a * 2;
    }
    return a;
  }, 0);
}

const result = document.body.innerText
  .split("\n")
  .slice(0, -1)
  .map((line) => [...line.matchAll(/\d{1,2}(?!\d*:)/g)])
  .map((arr) => arr.map((arr) => arr[0]))
  .reduce((acc, arr) => acc + calcScore(arr), 0);

console.log(result);
