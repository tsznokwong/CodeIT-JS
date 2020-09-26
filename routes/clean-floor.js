import { Router } from "express";
var router = Router();

router.post("/", function (req, res) {
  // res.setHeader("Content-Type", "application/json");
  console.log(req.body);
  console.log(req.body["tests"]);
  var response = {
    answers: {},
  };
  Object.keys(req.body["tests"]).forEach((key) => {
    response.answers[key] = req.body["tests"][key]["floor"].reduce(
      (sum, value) => {
        return sum + value;
      },
      2
    );
  });

  let result = JSON.stringify(response);
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;
