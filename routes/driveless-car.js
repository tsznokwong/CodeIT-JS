import { Router } from "express";
var router = Router();

router.post("/", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  let input = req.body;
  let gameId = input.gameId;
  let roads = input.roads;
  let finish = input.finish;
  let start = input.start;
  let vehicle = input.vehicle;

  let graph = getGraph(roads);
  console.log(graph.vertice);

  var instructions = [];

  let result = JSON.stringify({ gameId: gameId, instructions: instructions });
  console.log("My result--> %s", result);
  res.send(result);
});

export default router;

const getGraph = (roads) => {
  let streets = []; // Horizontal
  let avenues = []; // Vertical

  roads.forEach((road) => {
    if (road.type === "street") {
      streets.push(road);
    } else {
      avenues.push(road);
    }
  });

  const splitAvenue = (avenue, joint) => {
    let newAvenue = JSON.parse(JSON.stringify(avenue));
    newAvenue.from = joint;
    avenue.to = joint;
    avenues.push(newAvenue);
  };
  const splitStreet = (street, joint) => {
    let newStreet = JSON.parse(JSON.stringify(street));
    newStreet.from = joint;
    street.to = joint;
    streets.push(newStreet);
  };

  let edges = [];

  while (streets.length > 0) {
    let street = streets[0];
    for (var avenueIndex = 0; avenueIndex < avenues.length; avenueIndex++) {
      let avenue = avenues[avenueIndex];
      let joint = { x: avenue.from.x, y: street.from.y };
      if (
        (isStreetLeftJoinAvenue(street, avenue) ||
          isStreetRightJoinAvenue(street, avenue)) &&
        (isAvenueUpJoinStreet(street, avenue) ||
          isAvenueDownJoinStreet(street, avenue))
      ) {
        continue;
      }
      if (
        isStreetLeftJoinAvenue(street, avenue) ||
        isStreetRightJoinAvenue(street, avenue)
      ) {
        splitAvenue(avenue, joint);
      } else if (
        isAvenueUpJoinStreet(street, avenue) ||
        isAvenueDownJoinStreet(street, avenue)
      ) {
        splitStreet(street, joint);
      } else if (isRoadIntersect(street, avenue)) {
        console.log(streets, avenues);
        splitAvenue(avenue, joint);
        splitStreet(street, joint);
        console.log(streets, avenues);
      } else {
      }
    }
    edges.push(streets.shift());
  }
  edges = edges.concat(avenues);
  let vertice = {};
  edges.forEach((edge) => {
    let fromKey = getCoordinateKey(edge.from);
    let toKey = getCoordinateKey(edge.to);
    if (vertice[fromKey] === undefined) {
      vertice[fromKey] = {
        adjacentEdges: [],
      };
    }
    if (vertice[toKey] === undefined) {
      vertice[toKey] = {
        adjacentEdges: [],
      };
    }
    vertice[fromKey].adjacentEdges.push(edge);
    let reverseEdge = JSON.parse(JSON.stringify(edge));
    [reverseEdge.from, reverseEdge.to] = [reverseEdge.to, reverseEdge.from];
    vertice[toKey].adjacentEdges.push(reverseEdge);
  });

  return { edges: edges, vertice: vertice };
};

const getCoordinateKey = (p) => {
  return p.x.toString() + ", " + p.y.toString();
};

const isRoadIntersect = (street, avenue) => {
  let maxY = Math.max(avenue.from.y, avenue.to.y);
  let minY = Math.min(avenue.from.y, avenue.to.y);
  let inRangeY = maxY > street.from.y && street.from.y > minY;
  let maxX = Math.max(street.from.x, street.to.x);
  let minX = Math.min(street.from.x, street.to.x);
  let inRangeX = maxX > avenue.from.x && avenue.from.x > minX;
  console.log(inRangeY, inRangeX);
  return inRangeX && inRangeY;
};

const isStreetRightJoinAvenue = (street, avenue) => {
  let maxX = Math.max(street.from.x, street.to.x);
  return avenue.from.x === maxX;
};

const isStreetLeftJoinAvenue = (street, avenue) => {
  let minX = Math.min(street.from.x, street.to.x);
  return avenue.from.x === minX;
};

const isAvenueUpJoinStreet = (street, avenue) => {
  let maxY = Math.max(avenue.from.y, avenue.to.y);
  return street.from.y === maxY;
};

const isAvenueDownJoinStreet = (street, avenue) => {
  let minY = Math.min(avenue.from.y, avenue.to.y);
  return street.from.y === minY;
};

// motion system
const getRoadTime = (current_speed, end_speed, distance) => {
  return 2.0 * distance / (current_speed + end_speed);
};

const getAcceleration = (current_speed, end_speed, distance) => {
  return 1.0 * (current_speed * current_speed - end_speed * end_speed) / (2 * distance);
};

function motionControl() {
  let current_speed = 0;
}
