export const dmgTypes = {
  blunt: "BLUNT",
  piercing: "PIERCING",
  magical: "MAGICAL",
  healing: "HEALING",
  none: "NONE"
};
export const attackTypes = {
  singleTarget: "SINGLE",
  areaOfEffect: "AOE",
  self: "SELF",
  summoning: "SUMMONING"
};
const tokenType = {
  character: "character"
};

export const dataCharacters = [
  {
    id: 1,
    name: "King Richard",
    image: "/images/human_warrior_male.png",
    position: { x: 1, y: -6, z: 5 },
    dmg: 5,
    dmgType: dmgTypes.blunt,
    hp: {
      total: 50,
      current: 40
    },
    armor: 3,
    stats: {
      STR: 5,
      AGI: 5,
      INT: 2,
      PER: 2
    },
    specials: [
      {
        name: "Overpower",
        dmg: 10,
        dmgType: dmgTypes.blunt,
        attackType: attackTypes.singleTarget,
        icon: "overpower"
      },
      {
        name: "Bullwark",
        dmg: 10,
        dmgType: dmgTypes.none,
        attackType: attackTypes.self,
        icon: "bullwark"
      }
    ],
    type: tokenType.character
  },
  {
    id: 2,
    name: "Queen Mary",
    image: "/images/elf_warrior_female.png",
    position: { x: -1, y: -5, z: 6 },
    dmg: 2,
    dmgType: dmgTypes.piercing,
    hp: {
      total: 35,
      current: 5
    },
    armor: 1,
    stats: {
      STR: 2,
      AGI: 5,
      INT: 5,
      PER: 5
    },
    specials: [
      {
        name: "Heal",
        ap: 8,
        dmg: 10,
        dmgType: dmgTypes.healing,
        attackType: attackTypes.singleTarget,
        icon: "heal"
      }
    ],
    type: tokenType.character
  },
  {
    id: 3,
    name: "Legolas",
    image: "/images/elf_archer_male.png",
    position: { x: 0, y: 0, z: 0 },
    steps: 2,
    dmg: 5,
    dmgType: dmgTypes.piercing,
    hp: {
      total: 50,
      current: 50
    },
    armor: 1,
    stats: {
      STR: 5,
      AGI: 5,
      INT: 2,
      PER: 2
    },
    specials: [
      {
        name: "Volly",
        ap: 5,
        dmg: 5,
        dmgType: dmgTypes.piercing,
        attackType: attackTypes.areaOfEffect,
        icon: "volly"
      },
      {
        name: "Summon Beast",
        ap: 7,
        dmgType: dmgTypes.none,
        attackType: attackTypes.summoning,
        description: "Summon a companion",
        icon: "summon_beast"
      },
      {
        name: "Maul",
        ap: 4,
        dmg: 5,
        dmgType: dmgTypes.blunt,
        attackType: attackTypes.singleTarget,
        icon: "maul"
      },
      {
        name: "Hunter's Mark",
        dmgType: dmgTypes.none,
        attackType: attackTypes.singleTarget,
        description: "Increase target's dmg taken by 3",
        icon: "hunters_mark",
        effect: {
          armor: -3
        }
      }
    ],
    type: tokenType.character
  }
];

const wolf = position => ({
  id: ID(),
  hp: {
    total: 20,
    current: 20
  },
  dmg: 5,
  image: "/images/wolf.png",
  name: "Wolf",
  position: position,
  type: "opponent"
});

export const Opponents = {
  wolf
};

var ID = function() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
};
