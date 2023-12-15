const digitWords = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

function subDigits(str) {
  let testString = "";
  let returnString = "";
  let startIndex = 0;

  for (let charIndex = 0; charIndex < str.length; charIndex++) {
    testString = str.slice(startIndex, charIndex + 1);

    for (const word of digitWords) {
      if (testString.includes(word)) {
        testString = testString.replace(
          word,
          (digitWords.indexOf(word) + 1).toString()
        );
        returnString += testString;
        testString = "";
        startIndex = charIndex;
      }
    }
  }

  if (testString.length > 0) {
    returnString += testString;
  }

  return returnString;
}

const result = document.body.innerText
  .split("\n")
  .slice(0, 1000)
  .map((str) => subDigits(str))
  .map((str) => str.replaceAll(/[a-zA-Z]/g, ""))
  .map((str) => parseInt(str[0] + str[str.length - 1]))
  .reduce((prev, curr) => prev + curr, 0);

console.log(result);
