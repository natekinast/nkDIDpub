const data = document.body.innerText.trim().split("\n");

function isPartNumber(number, lineIndex, charIndex) {
  const numLines = data.length;
  const numChars = data[0].length;
  const symbolRegex = /[^0-9.]/;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= number.length; dx++) {
      const yPos = lineIndex + dy;
      const xPos = charIndex + dx;

      if (yPos >= 0 && yPos < numLines && xPos >= 0 && xPos < numChars) {
        const char = data[yPos][xPos];
        if (symbolRegex.test(char)) {
          return true;
        }
      }
    }
  }
  return false;
}

const partNumbers = data.flatMap((line, lineIndex) =>
  [...line.matchAll(/\d+/g)].flatMap((match) => {
    const number = match[0];
    const charIndex = match.index;
    if (isPartNumber(number, lineIndex, charIndex)) {
      return parseInt(number, 10);
    }
    return [];
  })
);

const result = partNumbers.reduce((acc, num) => acc + num, 0);
console.log(result);
