const addPositions = (p1, p2) => {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
    z: p1.z + p2.z
  };
};
const multiplyPosition = (p, scalar) => {
  return {
    x: p.x * scalar,
    y: p.y * scalar,
    z: p.z * scalar
  };
};
const positions = [
  { x: 0, y: 1, z: -1 }, // top
  { x: 1, y: 0, z: -1 }, // top-right
  { x: 1, y: -1, z: 0 }, // bottom-right
  { x: 0, y: -1, z: 1 }, // bottom
  { x: -1, y: 0, z: 1 }, // bottom-left
  { x: -1, y: 1, z: 0 } // top-left
];
const positions_2 = [
  { x: 0, y: 1, z: -1 }, // top
  { x: 1, y: 0, z: -1 }, // top-right
  { x: 1, y: -1, z: 0 }, // bottom-right
  { x: 0, y: -1, z: 1 }, // bottom
  { x: -1, y: 0, z: 1 }, // bottom-left
  { x: -1, y: 1, z: 0 }, // top-left

  { x: 0, y: 2, z: -2 }, // top
  { x: -1, y: 2, z: -1 }, // top
  { x: 2, y: 0, z: -2 }, // top-right
  { x: 1, y: 1, z: -2 }, // top-right
  { x: 2, y: -2, z: 0 }, // bottom-right
  { x: 2, y: -1, z: -1 }, // bottom-right
  { x: 0, y: -2, z: 2 }, // bottom
  { x: 1, y: -2, z: 1 }, // bottom
  { x: -2, y: 0, z: 2 }, // bottom-left
  { x: -1, y: -1, z: 2 }, // bottom-left
  { x: -2, y: 2, z: 0 }, // top-left
  { x: -2, y: 1, z: 1 } // top-left
];

export const getNeighbors = (
  characterPosition,
  opponentPositions,
  step = 1,
  max = 6
) => {
  const m = max + 1;
  if (!characterPosition) return null;

  let ps = step === 2 ? positions_2 : positions;

  return ps
    .map(p => addPositions(p, characterPosition))
    .filter(p => checkValid(p, m))
    .filter(p => !isIn(p, opponentPositions));
};

export const getNeighbouringOpponents = (character, opponents) => {
  const characterPosition = character.position;
  const surroundingPositions = positions.map(p =>
    addPositions(p, characterPosition)
  );
  const attackableOpponents = opponents.filter(o =>
    isIn(o.position, surroundingPositions)
  );
  return attackableOpponents;
};

export const getNeighbouringCharacters = (character, characters) => {
  const { steps = 1 } = character;
  const characterPositions = characters.map(c => c.position);
  const ps = steps === 2 ? positions_2 : positions;
  const surroundingPositions = ps
    .map(p => addPositions(p, character.position))
    .filter(p => checkValid(p, 7))
    .filter(p => isIn(p, characterPositions));
  return surroundingPositions;
};

export const checkValid = (p, m) => {
  return Math.abs(p.x) < m && Math.abs(p.y) < m && Math.abs(p.z) < m;
};
export const positionsAreEqual = (p1, p2) =>
  p1.x === p2.x && p1.y === p2.y && p1.z === p2.z;

export const isIn = (p, ps) =>
  ps.reduce((acc, p1) => (acc ? acc : positionsAreEqual(p, p1)), false);

const log = arg => {
  console.log(arg);
  return arg;
};
