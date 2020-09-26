import { Router } from "express";
var router = Router();

const roll = () => {
  return Math.floor(Math.random() * 6) + 1;
};

router.post("/", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  let input = req.body;
  let boardSize = input["boardSize"];
  let players = input["players"];
  let jumps = input["jumps"];
  let board = new Array(boardSize + 1);
  jumps.forEach((jump) => {
    let [from, to] = jump.split(":");
    from = parseInt(from);
    to = parseInt(to);
    if (from === 0) {
      board[to] = { type: "mirror" };
    } else if (to === 0) {
      board[from] = { type: "smoke" };
    } else if (from > to) {
      board[from] = { type: "snake", to: to };
    } else {
      board[from] = { type: "ladder", to: to };
    }
  });
  console.log(boardSize, players, JSON.stringify(board));

  const findRoll = (current, reverse = false) => {
    let max = 0;
    let rolls = [];
    for (let i = 1; i <= 6; i++) {
      let move = reverse ? -i : i;
      if (current + move <= 0) {
        continue;
      }
      let step = board[current + move];
      // console.log(step);
      if (step === undefined) {
        if (current + move > max) {
          max = current + move;
          rolls = [i];
        }
      } else {
        if (step.type === "ladder" || step.type === "snake") {
          if (step.to > max) {
            max = step.to;
            rolls = [i];
          }
        } else if (step.type === "mirror") {
          let { mirrorRolls, next } = findRoll(current + move);
          if (next > max) {
            max = next;
            rolls = mirrorRolls;
          }
        }
        //  else {
        //   return findRoll(current + move, true);
        // }
      }
    }
    return { rolls, max };
  };

  // console.log(board);
  let current = 1;
  let rolls = [];
  while (boardSize - current > 6) {
    let { rolls: nextRolls, max } = findRoll(current);
    console.log(nextRolls, max);
    rolls = rolls.concat(
      Array(players)
        .fill(nextRolls)
        .flatMap((x) => x)
    );
    current = max;
  }
  if (boardSize - current === 1) {
    rolls = rolls.concat(Array(players - 1).fill(2));
  } else {
    rolls = rolls.concat(Array(players - 1).fill(1));
  }

  rolls.push(boardSize - current);

  let result = JSON.stringify(rolls);
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;
