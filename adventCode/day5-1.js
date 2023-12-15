const seeds = [...document.body.innerText.match(/seeds: (.+)/)][1]
  .split(" ")
  .map((seedNum) => parseInt(seedNum));

const maps = [
  ...document.body.innerText
    .concat("\n")
    .matchAll(/(\w+)-\w+-(\w+) map:\n([\d\s]+)\n\n/g),
].map((matchArr) =>
  matchArr[3]
    .split(/\n/)
    .map((numArr) => numArr.split(" ").map((numStr) => parseInt(numStr)))
);

function useMap(mapIndex, sourceNum) {
  if (mapIndex >= maps.length) return;

  const mapArray = maps[mapIndex]
    .filter((arr) => sourceNum >= arr[1] && sourceNum < arr[1] + arr[2])
    .flat();
  if (mapArray.length === 0) return sourceNum;
  return sourceNum - mapArray[1] + mapArray[0];
}

const result = seeds.reduce((lowestLoc, seedNum) => {
  const seedLoc = maps.reduce((currentSource, _, currentMapIndex) => {
    return useMap(currentMapIndex, currentSource);
  }, seedNum);
  return Math.min(lowestLoc, seedLoc);
});

console.log(result);
