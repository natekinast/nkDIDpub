const text = `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`;

const data = text
  .trim()
  .split("\n")
  .map((str) => str.split(""));

const nodeMap = data.map((arr, y) =>
  arr.map((str, x) => {
    const returnObj = {
      position: [x, y],
      links: [],
    };

    switch (str) {
      case ".": {
        break;
      }
      case "S":
      case "F": {
        returnObj.links.push([x + 1, y], [x, y + 1]);
        break;
      }
      // case "S":
      case "7": {
        returnObj.links.push([x - 1, y], [x, y + 1]);
        break;
      }
      case "J": {
        returnObj.links.push([x - 1, y], [x, y - 1]);
        break;
      }
      // case "S":
      case "L": {
        returnObj.links.push([x, y - 1], [x + 1, y]);
        break;
      }
      case "-": {
        returnObj.links.push([x - 1, y], [x + 1, y]);
        break;
      }
      case "|": {
        returnObj.links.push([x, y - 1], [x, y + 1]);
        break;
      }
    }
    return returnObj;
  })
);

function arrayEquals(first, second) {
  return (
    Array.isArray(first) &&
    Array.isArray(second) &&
    first.length === second.length &&
    first.every((val, index) => val === second[index])
  );
}

function getNextNode(node1, node2, map) {
  const nextPos = node2.links.filter(
    (arr) => !arrayEquals(arr, node1.position)
  )[0];
  return map[nextPos[1]][nextPos[0]];
}

const startNode = nodeMap[4][12];
let currentNode = nodeMap[5][12];
let nodeHist = [startNode, currentNode];

while (!arrayEquals(startNode.position, currentNode.position)) {
  currentNode = getNextNode(
    nodeHist[nodeHist.length - 2],
    nodeHist[nodeHist.length - 1],
    nodeMap
  );
  nodeHist.push(currentNode);
}

nodeHist = nodeHist.slice(0, -1);

function isInterior(node, hist) {
  const hitChars = ["|", "L", "J", "F", "7"];
  let posX = node.position[0];
  const posY = node.position[1];
  let hits = 0;

  while (posX >= 0) {
    const char = data[posY][posX];
    if (
      hitChars.includes(char) &&
      hist.some((histNode) => arrayEquals(histNode.position, [posX, posY]))
    ) {
      if (char === "J") {
        const testStr = data[posY].slice(0, posX + 1).join("");
        if (
          testStr.match(/F-*J/) !== null &&
          testStr.endsWith(testStr.match(/F-*J/).slice(-1)[0])
        ) {
          hits += 1;
        }
      }
      if (char === "7") {
        const testStr = data[posY].slice(0, posX + 1).join("");
        if (
          testStr.match(/L-*7/) !== null &&
          testStr.endsWith(testStr.match(/L-*7/).slice(-1)[0])
        ) {
          hits += 1;
        }
      }

      if (char === "|") hits += 1;
    }
    posX -= 1;
  }

  return parseInt(hits) % 2 !== 0;
}

const result = nodeMap.reduce(
  (acc, row) =>
    acc +
    row.filter((node) => {
      const char = data[node.position[1]][node.position[0]];
      const isGround = !nodeHist.some((histNode) =>
        arrayEquals(node.position, histNode.position)
      );
      const isInt = isInterior(node, nodeHist);
      console.log(node.position, isGround && isInt);
      return isGround && isInt;
    }).length,
  0
);

console.log(result);
