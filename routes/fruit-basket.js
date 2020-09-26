import { Router } from "express";
var router = Router();

router.post("/", function (req, res) {
  let fruits = [
    "maApple",
    "maWatermelon",
    "maBanana",
    "maRamubutan",
    "maPineapple",
    "maAvocado",
    "maPomegranate",
  ];
  // let guess = [7, 67, 40, 14, 45, 70, 30]; 395 { maRamubutan: 98, maPineapple: 5, maAvocado: 86 } 7617 200g away
  // let guess = [44, 22, 40, 14, 60, 70, 20]; 480 { maRamubutan: 82, maWatermelon: 35, maAvocado: 70 } 6818 0g away
  // let guess = [44, 21, 40, 14, 60, 70, 20]; 325 { maPomegranate: 12, maPineapple: 47, maAvocado: 30 } 5160 200g away
  // let guess = [44, 21, 40, 14, 60, 70, 21]; 0 { maPomegranate: 95, maRamubutan: 25, maPineapple: 31 } 4205 2400g away
  // let guess = [44, 21, 40, 14, 56, 70, 17]; 300 { maPomegranate: 37, maWatermelon: 20, maAvocado: 14 } 2029 300g away
  // let guess = [44, 21, 40, 14, 56, 70, 18]; 365 { maPomegranate: 90, maRamubutan: 84, maApple: 78 } 6228 100g
  // let guess = [45, 21, 40, 14, 56, 70, 18]; 55 { maRamubutan: 78, maPineapple: 43, maApple: 95 } 7775 2200g
  // let guess = [31, 21, 40, 14, 54, 70, 18]; 5 { maPineapple: 39, maApple: 91, maWatermelon: 27 } 5494 4400g
  // let guess = [42, 23, 40, 14, 54, 70, 18]; 220 { maPomegranate: 62, maPineapple: 96, maApple: 50 } 8400 700g
  // let guess = [42, 23, 40, 14, 52, 70, 16]; 125 { maRamubutan: 74, maApple: 33, maWatermelon: 28 } 3066 500g
  // let guess = [42, 24, 40, 15, 52, 70, 16];{ maPineapple: 91, maWatermelon: 39, maAvocado: 74 } 10848 1000g
  // let guess = [42, 25, 40, 15, 56, 70, 16];{ maPomegranate: 86, maApple: 34, maAvocado: 63 } 7214 600g
  let guess = [44, 25, 40, 15, 56, 70, 14];

  let input = JSON.parse(req.body);
  console.log(input);
  let value = fruits.reduce((sum, fruit, index) => {
    let count = input[fruit];
    if (count) {
      return sum + count * guess[index];
    } else {
      return sum;
    }
  }, 0);
  let result = JSON.stringify(value);
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;
