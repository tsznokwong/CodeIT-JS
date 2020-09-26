import { Router } from "express";
var router = Router();

router.post("/", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  console.log(req.body);
  var response = req.body;
  response["list"] = response["list"].map((value) => {
    var originalSequence = value["geneSequence"];
    var countA = originalSequence.split("A").length - 1;
    var countC = originalSequence.split("C").length - 1;
    var countG = originalSequence.split("G").length - 1;
    var countT = originalSequence.split("T").length - 1;
    console.log(countA + countC + countG + countT);
    let min = Math.min(countA, countC, countG, countT);
    let countACGT = 0;
    let maxScore = 0;
    for (let x = 0; x <= min; x++) {
      let score = 15 * x + 25 * Math.floor((countC - x) / 2);
      if (score >= maxScore) {
        maxScore = score;
        countACGT = x;
      }
    }
    let countCC = Math.floor((countC - countACGT) / 2);
    countA -= countACGT;
    countC -= countACGT + countCC * 2;
    countG -= countACGT;
    countT -= countACGT;
    console.log(
      countA + countC + countG + countT + countCC * 2 + countACGT * 4
    );
    let sequence = "";
    while (countA > 0) {
      console.log(
        countA +
          countC +
          countG +
          countT +
          countCC * 2 +
          countACGT * 4 +
          sequence.length
      );
      if (countACGT > 0) {
        sequence += "AACGT";
        countACGT--;
        countA--;
      } else {
        let reduceA = Math.min(2, countA);
        countA -= reduceA;
        sequence += "A".repeat(reduceA);
        if (countCC > 0) {
          sequence += "CC";
          countCC--;
        } else if (countC > 0) {
          sequence += "C";
          countC--;
        } else if (countG > 0) {
          sequence += "G";
          countG--;
        } else if (countT > 0) {
          sequence += "T";
          countT--;
        } else {
          sequence += "A".repeat(countA);
          countA = 0;
        }
      }
    }
    sequence += "ACGT".repeat(countACGT);
    sequence += "CC".repeat(countCC);
    sequence += "C".repeat(countC);
    sequence += "G".repeat(countG);
    sequence += "T".repeat(countT);
    countACGT = 0;
    countCC = 0;
    countC = 0;
    countG = 0;
    countT = 0;
    console.log(countA, countC, countG, countT, countCC, countACGT);
    console.log(sequence.length === originalSequence.length);
    return { id: value["id"], geneSequence: sequence };
  });

  let result = JSON.stringify(response);
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;
