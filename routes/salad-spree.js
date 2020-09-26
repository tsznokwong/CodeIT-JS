import { Router } from "express";
var router = Router();

router.post("/", function (req, res) {
  let number_of_salads = parseInt(req.body["number_of_salads"]);
  let salad_prices_street_map = req.body["salad_prices_street_map"];

  //   console.log(req.body);
  let minimum = salad_prices_street_map.reduce((min, street) => {
    let start = 0;
    let end = 0;
    let totalPrice = 0;
    let currentMin = min;
    let length = street.length;
    while (end < length) {
      if (street[end] === "X") {
        start = end + 1;
        end++;
        continue;
      }
      let price = parseInt(street[end]);
      totalPrice += price;
      if (end - start + 1 === number_of_salads) {
        currentMin = Math.min(currentMin, totalPrice);
      } else if (end - start + 1 > number_of_salads) {
        totalPrice -= street[start];
        currentMin = Math.min(currentMin, totalPrice);
        start++;
      }
      end++;
    }
    return currentMin;
  }, Number.MAX_SAFE_INTEGER);

  if (minimum === Number.MAX_SAFE_INTEGER) {
    minimum = 0;
  }
  let result = JSON.stringify({ result: minimum });
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;
