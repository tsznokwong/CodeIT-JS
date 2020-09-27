import { Router } from "express";
var router = Router();

router.post("/", function (req, res) {
  res.setHeader("Content-Type", "application/json");

  let tests = req.body.tests;
  let response = {
    answers: {},
  };
  Object.keys(tests).forEach((key) => {
    let map = tests[key].maze;
    let start = tests[key].start;
    let end = tests[key].end;
    console.log(map, start, end);
    let result = dfs(map, start, end, 0);
    if (result === Number.MAX_SAFE_INTEGER) {
      result = -1;
    }
    response.answers[key] = result;
  });

  let result = JSON.stringify(response);
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;

const copyMaze = (maze) => {
  return maze.map((row) => {
    return [...row];
  });
};

const delta = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const isInMaze = (maze, x, y) => {
  let yLength = maze.length;
  let xLength = maze[0].length;
  return x >= 0 && x < xLength && y >= 0 && y < yLength;
};

const isWalkable = (maze, x, y) => {
  return maze[y][x] === 0;
};

const dfs = (maze, current, end, level) => {
  let newMaze = copyMaze(maze);
  let x = current[0];
  let y = current[1];
  newMaze[y][x] = 1;
  if ((end[0] === current[0], end[1] === current[1])) {
    return level + 1;
  }
  let min = Number.MAX_SAFE_INTEGER;
  delta.forEach((d) => {
    let newX = x + d[0];
    let newY = y + d[1];
    if (isInMaze(newMaze, newX, newY) && isWalkable(newMaze, newX, newY)) {
      let nextLevel = dfs(newMaze, [newX, newY], end, level + 1);
      if (nextLevel < min) {
        min = nextLevel;
      }
      return;
    }
  });
  return min;
};
