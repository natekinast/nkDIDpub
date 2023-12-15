const data = document.body.innerText
  .split("\n")
  .slice(0, -1)
  .map((line) => [...line.matchAll(/\d{1,2}(?!\d*:)/g)])
  .map((arr) => arr.map((arr) => arr[0]));

let cardCounts = new Array(data.length).fill(1, 0);

function countWinningNumbers(cardArray) {
  const winArray = cardArray.slice(0, 10);
  const numArray = cardArray.slice(10);
  return numArray.reduce((a, b) => {
    if (winArray.includes(b)) {
      return a + 1;
    }
    return a;
  }, 0);
}

function updateCardCounts(cardNum, wins) {
  const multiplier = cardCounts[cardNum];
  cardCounts = cardCounts.map((count, index) => {
    if (index > cardNum && index <= cardNum + wins) {
      return count + 1 * multiplier;
    }
    return count;
  });
}

data.forEach((line, index) => {
  const wins = countWinningNumbers(line);
  console.log(`Card ${index} wins ${wins} cards.`);

  updateCardCounts(index, wins);
});

const result = cardCounts.reduce((a, b) => a + b);
console.log(result);
