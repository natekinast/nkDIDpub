const cardConversions = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
};

function scoreHand(handArray) {
  let handType;
  const unique = new Set(handArray);

  switch (unique.size) {
    // 5 of a kind
    case 1: {
      handType = 7;
      break;
    }
    // high card
    case 5: {
      handType = 1;
      break;
    }
    // 1 pair
    case 4: {
      handType = 2;
      break;
    }
    // 4 of a kind or full house
    case 2: {
      handType = [1, 4].includes(
        handArray.filter((card) => card === handArray[0]).length
      )
        ? 6
        : 5;
      break;
    }
    // 3 of a kind or 2 pair
    case 3: {
      const counts = [];
      unique.forEach((uniqueCard) => {
        counts.push(handArray.filter((card) => card === uniqueCard).length);
      });

      handType = counts.reduce((a, b) => Math.max(a, b)) === 3 ? 4 : 3;

      break;
    }
  }

  const score =
    handType * 10 ** 10 +
    handArray.reduce((acc, num, index) => acc + num * 10 ** (8 - 2 * index), 0);
  return score;
}

const result = document.body.innerText
  .trim()
  .split("\n")
  .map((str) => [
    str
      .slice(0, 5)
      .split("")
      .map((cardStr) => {
        const tryNum = parseInt(cardStr);
        if (isNaN(tryNum)) {
          return cardConversions[cardStr];
        }
        return tryNum;
      }),
    parseInt(str.slice(6)),
  ])
  .sort((hand1, hand2) => (scoreHand(hand1[0]) < scoreHand(hand2[0]) ? -1 : 1))
  .reduce((acc, hand, index) => acc + hand[1] * (index + 1), 0);

console.log(result);
