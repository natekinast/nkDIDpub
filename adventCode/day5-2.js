const seeds = [...document.body.innerText.match(/seeds: (.+)/)][1]
  .split(" ")
  .map((seedNum) => parseInt(seedNum))
  .map((seedNum, index, arr) => {
    if (index % 2 === 0) {
      return seedNum;
    }
    return arr[index - 1] + arr[index];
  });

const seedRangeArrays = [];

for (let i = 0; i < seeds.length; i += 2) {
  seedRangeArrays.push(seeds.slice(i, i + 2));
}

console.log(seedRangeArrays.sort((a, b) => (a[0] < b[0] ? -1 : 1)));

const maps = [
  ...document.body.innerText
    .concat("\n")
    .matchAll(/(\w+)-\w+-(\w+) map:\n([\d\s]+)\n\n/g),
].map((matchArr) =>
  matchArr[3]
    .split(/\n/)
    .map((numArr) => numArr.split(" ").map((numStr) => parseInt(numStr)))
);

function reverseMap(mapIndex, destNum) {
  if (mapIndex >= maps.length) return;

  const mapArray = maps[mapIndex]
    .filter((arr) => destNum >= arr[0] && destNum < arr[0] + arr[2])
    .flat();
  if (mapArray.length === 0) return destNum;
  return destNum - mapArray[0] + mapArray[1];
}

function backTrack(destNum) {
  return maps.reduceRight((currentDest, _, currentMapIndex) => {
    return reverseMap(currentMapIndex, currentDest);
  }, destNum);
}

function isInRange(num) {
  return seedRangeArrays.some((arr) => num >= arr[0] && num < arr[1]);
}

let index = 1;

while (!isInRange(backTrack(index))) {
  index++;
}

console.log(index);
