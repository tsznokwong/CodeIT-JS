import { Router } from "express";
import { token } from "morgan";
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
  let data = dijkstra(graph, { x: start.x, y: start.y - 2.5 });
  console.log(data);

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
        splitAvenue(avenue, joint);
        splitStreet(street, joint);
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

const dijkstra = (graph, source) => {
  let verticeData = {};
  let queue = [];
  Object.keys(graph.vertice).forEach((vertex) => {
    verticeData[vertex] = {
      dist: Number.MAX_SAFE_INTEGER,
      prev: undefined,
    };
    queue.push(vertex);
  });
  let sourceKey = getCoordinateKey(source);
  verticeData[sourceKey].dist = 0;

  const dist = (u, edge) => {
    if (edge.type === "street") {
      return Math.abs(edge.from.x - edge.to.x);
    } else {
      return Math.abs(edge.from.y - edge.to.y);
    }
  };

  while (queue.length > 0) {
    // find min dist vertex
    let mininum = Number.MAX_SAFE_INTEGER;
    let u = undefined;
    let i = undefined;
    queue.forEach((vertex, index) => {
      if (verticeData[vertex].dist < mininum) {
        u = vertex;
        mininum = verticeData[vertex].dist;
        i = index;
      }
    });
    // remove u
    u = queue.splice(i, 1);

    graph.vertice[u].adjacentEdges.forEach((edge) => {
      let toKey = getCoordinateKey(edge.to);
      if (!queue.includes(toKey)) {
        return;
      }
      let alt = mininum + dist(u, edge);
      if (alt < verticeData[toKey].dist) {
        verticeData[toKey].dist = alt;
        verticeData[toKey].prev = u;
      }
    });
  }
  return verticeData;
};

const getCoordinateKey = (p) => {
  return p.x.toString() + ", " + p.y.toString();
};

const parseCoordinateKey = (key) => {
  let coor = key.split(", ");
  return {
    x: coor[0],
    y: coor[1],
  };
};

const isRoadIntersect = (street, avenue) => {
  let maxY = Math.max(avenue.from.y, avenue.to.y);
  let minY = Math.min(avenue.from.y, avenue.to.y);
  let inRangeY = maxY > street.from.y && street.from.y > minY;
  let maxX = Math.max(street.from.x, street.to.x);
  let minX = Math.min(street.from.x, street.to.x);
  let inRangeX = maxX > avenue.from.x && avenue.from.x > minX;
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
const getRoadDistance = (road) => {
  if (road.type === "street") {
    return Math.abs(road.from.x - road.to.x);
  } else {
    return Math.abs(road.from.y - road.to.y);
  }
};

const getRoadTime = (current_speed, end_speed, distance) => {
  return (2.0 * distance) / (current_speed + end_speed);
};

const getRoadAcceleration = (current_speed, end_speed, distance) => {
  return (
    (1.0 * (current_speed * current_speed - end_speed * end_speed)) /
    (2 * distance)
  );
};

const getTurnDistance = (isLeftTurn) => {
  if (isLeftTurn) {
    return (2 * Math.PI * 2.5) / 4;
  } else {
    return (2 * Math.PI * 7.5) / 4;
  }
};

const getTurnTime = (isLeftTurn, speed = 5.0) => {
  // assume const speed 5 m/s
  if (isLeftTurn) {
    return (2 * Math.PI * 2.5) / 4 / speed;
  } else {
    return (2 * Math.PI * 7.5) / 4 / speed;
  }
};
