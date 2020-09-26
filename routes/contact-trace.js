import { Router } from "express";
var router = Router();

const dist = (a, b) => {
  let geneA = a["genome"].split("");
  let geneB = b["genome"].split("");
  return geneA.reduce((count, value, index) => {
    return value === geneB[index] ? count : count + 1;
  }, 0);
};

const isNonSilentMutation = (a, b) => {
  let geneA = a["genome"].split("-");
  let geneB = b["genome"].split("-");
  return (
    geneA.reduce((count, value, index) => {
      return value.split("")[0] === geneB[index].split("")[0]
        ? count
        : count + 1;
    }, 0) > 1
  );
};

const mutatable = (a, b) => {
  let changes = dist(a, b);
  return changes >= 0 && changes <= 2;
};

const appendPath = (path, a, b) => {
  if (isNonSilentMutation(a, b)) {
    return path + "* -> " + b["name"];
  } else {
    return path + " -> " + b["name"];
  }
};

const find = (path, current, origin, cluster) => {
  let solutions = [];
  if (mutatable(current, origin)) {
    solutions.push(appendPath(path, current, origin));
  }
  cluster.forEach((value) => {
    if (path.includes(value["name"])) {
      return;
    }
    if (mutatable(current, value)) {
      if (dist(value, origin) === 0) {
        solutions.push(appendPath(path, current, value));
      } else {
        solutions = solutions.concat(
          find(appendPath(path, current, value), value, origin, cluster)
        );
      }
    }
  });
  return solutions;
};

router.post("/", function (req, res) {
  // res.setHeader("Content-Type", "application/json");
  let infect = req.body["infected"];
  let origin = req.body["origin"];
  let cluster = req.body["cluster"];
  console.log(req.body);
  var response = find(infect["name"], infect, origin, cluster);
  if (response.length === 0) {
    response = [appendPath(infect["name"], infect, origin)];
  }

  let result = JSON.stringify(response);
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;
