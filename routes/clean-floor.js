import { Router } from "express";
var router = Router();

router.post("/", function (req, res) {
  // res.setHeader("Content-Type", "application/json");
  let tests = req.body["tests"];
  let response = {
    answers: {},
  };
  Object.keys(tests).forEach((key) => {
    let count = 0;
    let floor = tests[key]["floor"];
    console.log(floor);
    let distance = floor.length;
    let sum = floor.reduce((sum, value) => sum + value, 0);
    for (let i = 0; i < distance - 1; i++) {
      count += floor[i] * 2;
      let beforeNext = floor[i + 1];
      if (floor[i] > 0) {
        if (floor[i + 1] < floor[i]) {
          floor[i + 1] = (floor[i] - floor[i + 1]) % 2;
        } else {
          floor[i + 1] -= floor[i];
        }
        sum -= floor[i] + (beforeNext - floor[i + 1]);
        floor[i] = 0;
      }
      if (sum === 0) {
        console.log("EARLY BREAK");
        break;
      }
      if (floor[i + 1] >= 1) {
        floor[i + 1]--;
        sum--;
      } else {
        floor[i + 1]++;
        sum++;
      }
      ++count;
    }
    console.log(count, floor);
    if (floor[distance - 1] > 0) {
      count += floor[distance - 1] * 2;
      count += floor[distance - 1] % 2;
    }

    response.answers[key] = count;
  });

  let result = JSON.stringify(response);
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;
