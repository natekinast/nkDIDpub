const result = document.body.innerText
  .split("\n")
  .slice(0, 1000)
  .map((str) => str.replaceAll(/[a-zA-Z]/g, ""))
  .map((str) => parseInt(str[0] + str[str.length - 1]))
  .reduce((prev, curr) => prev + curr, 0);

console.log(result);
