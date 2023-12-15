function findPartNumberPairs(data) {
  const partNumberPairs = [];
  const numLines = data.length;
  const numChars = data[0].length;

  function getCompleteNumber(yPos, xPos) {
    while (xPos > 0 && /[0-9]/.test(data[yPos][xPos - 1])) {
      xPos--;
    }
    return data[yPos].substr(xPos).match(/^\d+/)[0];
  }

  function getAdjacentPartNumbers(lineIndex, charIndex) {
    const partNumbers = new Set();

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dy === 0 && dx === 0) continue;

        const yPos = lineIndex + dy;
        const xPos = charIndex + dx;

        if (
          yPos >= 0 &&
          yPos < numLines &&
          xPos >= 0 &&
          xPos < numChars &&
          /[0-9]/.test(data[yPos][xPos])
        ) {
          const completeNumber = getCompleteNumber(yPos, xPos);
          partNumbers.add(parseInt(completeNumber, 10));
        }
      }
    }

    return Array.from(partNumbers);
  }

  for (let lineIndex = 0; lineIndex < numLines; lineIndex++) {
    for (let charIndex = 0; charIndex < numChars; charIndex++) {
      if (data[lineIndex][charIndex] === "*") {
        const partNumbers = getAdjacentPartNumbers(lineIndex, charIndex);
        if (partNumbers.length === 2) {
          partNumberPairs.push(partNumbers);
        }
      }
    }
  }

  return partNumberPairs;
}

const data = document.body.innerText.trim().split("\n");
const pairs = findPartNumberPairs(data);
console.log(pairs);
