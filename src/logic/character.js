/**
 * This file should only contain game logic which is necessary for
 * characters. Don't clutter!!
 */

export const harm = (character, dmg) => {
  const armor = character.armor || 1;
  const realDMG = dmg - armor < 1 ? 0 : dmg - armor;
  const newCurrent = character.hp.current - realDMG;
  return {
    ...character,
    hp: {
      ...character.hp,
      current: newCurrent < 1 ? 0 : newCurrent
    }
  };
};

export const heal = (character, dmg) => {
  const newCurrent = character.hp.current + dmg;
  return {
    ...character,
    hp: {
      ...character.hp,
      current: newCurrent > character.hp.total ? character.hp.total : newCurrent
    }
  };
};
