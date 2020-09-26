import { Router } from "express";
var router = Router();

let calculated = {};

const preCalculated = (elements, number_of_elements, number_of_operations) => {
  let elementLevel = calculated[elements.join("")];
  if (elementLevel === undefined) {
    return undefined;
  }
  let numberOfElementsLevel = elementLevel[number_of_elements];
  if (numberOfElementsLevel === undefined) {
    return undefined;
  }
  return numberOfElementsLevel[number_of_operations];
};

const storePreCalculated = (
  elements,
  number_of_elements,
  number_of_operations,
  value
) => {
  let numberOfElementsLevel = {};
  numberOfElementsLevel[number_of_operations] = value;
  let elementsLevel = {};
  elementsLevel[number_of_elements] = numberOfElementsLevel;
  calculated[elements.join("")] = elementsLevel;
};

const expectedValue = (elements, number_of_elements, number_of_operations) => {
  let storedValue = preCalculated(
    elements,
    number_of_elements,
    number_of_operations
  );
  if (storedValue !== undefined) {
    return storedValue;
  }
  if (number_of_operations === 0) {
    return 0;
  }
  if (number_of_elements === 1) {
    return elements[0] === "Y" ? 1 : 0;
  }
  let sum = 0;
  for (let i = 0; i <= Math.floor(number_of_elements / 2) - 1; i++) {
    const elementsL = [...elements];
    elementsL.splice(i, 1);
    let expectedL = expectedValue(
      elementsL,
      number_of_elements - 1,
      number_of_operations - 1
    );
    if (elements[i] === "Y") {
      expectedL++;
    }

    const elementsR = [...elements];
    elementsR.splice(number_of_elements - i - 1, 1);
    let expectedR = expectedValue(
      elementsR,
      number_of_elements - 1,
      number_of_operations - 1
    );
    if (elements[number_of_elements - i - 1] === "Y") {
      expectedR++;
    }

    let expected = Math.max(expectedL, expectedR);
    sum += (expected * 2) / number_of_elements;
  }
  if (number_of_elements % 2) {
    const i = Math.floor(number_of_elements / 2);
    const elementsM = [...elements];
    elementsM.splice(i, 1);
    let expectedM = expectedValue(
      elementsM,
      number_of_elements - 1,
      number_of_operations - 1
    );
    if (elements[i] === "Y") {
      expectedM++;
    }
    sum += expectedM / number_of_elements;
  }
  storePreCalculated(elements, number_of_elements, number_of_operations, sum);
  return sum;
};

router.post("/", function (req, res) {
  // calculated = {};
  res.setHeader("Content-Type", "application/json");
  let number_of_elements = req.body["number_of_elements"];
  let number_of_operations = req.body["number_of_operations"];
  let elements = req.body["elements"].split("");

  let expected = expectedValue(
    elements,
    number_of_elements,
    number_of_operations
  );

  let result = JSON.stringify({ result: expected });
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;
