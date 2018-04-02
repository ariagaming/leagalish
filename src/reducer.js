import { createStore } from "redux";
import { connect } from "react-redux";
import { dataCharacters, dmgTypes, Opponents } from "./data/models";
import {
  getNeighbors,
  getNeighbouringOpponents,
  getNeighbouringCharacters
} from "./positions";
import { harm, heal } from "./logic/character";

const log = arg => {
  console.log(arg);
  return arg;
};

const initalState = {
  ap: 10,
  characters: dataCharacters,
  actionLog: [],
  opponents: [
    Opponents.wolf({
      x: 0,
      y: -5,
      z: 5
    })
  ]
};
const findPosition = (p1, p2) =>
  p1.x === p2.x && p1.y === p2.y && p1.z === p2.z;

const reducer = (state = initalState, command) => {
  //console.log(command.type);
  if (command.type === "RESET_BOARD") {
    return {
      ...initalState
    };
  } else if (command.type === "SELECT_HEX") {
    const newSelectedCharacter = {
      ...state.selectedCharacter,
      position: command.payload
    };
    const newCharacters = state.characters.map(
      c => (c.id === state.selectedCharacter.id ? newSelectedCharacter : c)
    );
    const neighbours = getNeighbors(
      command.payload,
      newCharacters.concat(state.opponents).map(o => o.position),
      state.selectedCharacter.steps
    );
    const neighbouringCharacters = getNeighbouringCharacters(
      newSelectedCharacter,
      newCharacters
    );
    const neighbouringOpponents = getNeighbouringCharacters(
      newSelectedCharacter,
      state.opponents
    );
    if (state.selectedCharacter) {
      return {
        ...state,
        characters: newCharacters || [],
        neighbours: neighbours || [],
        neighbouringCharacters: neighbouringCharacters || [],
        neighbouringOpponents: neighbouringOpponents || []
      };
    }
  } else if (command.type === "SELECT_CHARACTER") {
    // check
    const character =
      !state.selectedCharacter ||
      state.selectedCharacter.id !== command.payload.id
        ? command.payload
        : null;
    window.coords = character ? character.position : null;
    const neighbours = character
      ? getNeighbors(
          command.payload.position,
          state.characters.concat(state.opponents).map(o => o.position),
          command.payload.steps
        )
      : null;
    const neighbouringCharacters = getNeighbouringCharacters(
      character,
      state.characters
    );
    const neighbouringOpponents = getNeighbouringCharacters(
      character,
      state.opponents
    );
    return {
      ...state,
      selectedCharacter: character,
      neighbours: neighbours || [],
      neighbouringCharacters: neighbouringCharacters || [],
      neighbouringOpponents: neighbouringOpponents || []
    };
  } else if (command.type === "SELECT_OPPONENT") {
    // test if we have a selected character and if that seelcted character has a special
    if (
      state.selectedCharacter &&
      state.selectedCharacter.specials.length > 0
    ) {
      // this special can either be a single target special, or an area of effect special.
      const special = state.selectedCharacter.specials[0];
      const { name, dmg, dmgType, attackType } = special;

      // we can't heal enemies
      if (dmgType !== dmgTypes.healing) {
        const newOpponents = state.opponents.map(o => {
          if (o.id === command.payload.id) {
            return harm(o, dmg);
          } else {
            return o;
          }
        });
        return {
          ...state,
          opponents: newOpponents || []
        };
      }
    }
  } else if (command.type === "CELL_HOVER") {
    return {
      ...state,
      hover: {
        ...command.payload
      }
    };
  } else if (command.type === "HARM") {
    const newCharacters = state.characters.map(
      c => (c.id === command.payload ? harm(c, 10) : c)
    );
    return {
      ...state,
      characters: newCharacters
    };
  } else if (command.type === "ATTACK_OPPONENTS") {
    const character = state.characters.find(c => c.id === command.payload);
    const opponentIds = getNeighbouringOpponents(
      character,
      state.opponents
    ).map(o => o.id);

    return {
      ...state,
      opponents: state.opponents.map(o => {
        if (opponentIds.indexOf(o.id) > -1)
          return harm(o, state.selectedCharacter.dmg);
        else return o;
      })
    };
  } else if (command.type === "END_TURN") {
    // here we end the turn which does the following:
    // 1) DMG every target in range of a character
    // 2) Remove dead opponnents
    // 3) Opponets "do their thing"
    // 4) Reset Action Points
    // 5) Environment actions

    let { characters, opponents } = state;
    let actionLog = state.actionLog;

    // 1) Get all the targets which are in range, for each character:
    characters.forEach(character => {
      const neighbours = getNeighbouringOpponents(character, opponents);
      neighbours.forEach(neighbour => {
        opponents = opponents.map(o => {
          if (o.id === neighbour.id) {
            actionLog.unshift({
              source: character.name,
              target: o.name,
              dmg: character.dmg
            });
            return harm(o, character.dmg);
          } else {
            return 0;
          }
        });
      });
    });

    // 2) Filter the dead enemies
    opponents = opponents.filter(o => o.hp.current > 0);

    // 3) Opponents attack every character in range of their attack
    opponents.forEach(opponent => {
      const neighbours = getNeighbouringOpponents(opponent, characters);
      neighbours.forEach(neighbour => {
        characters = characters.map(o => {
          if (o.id === neighbour.id) {
            actionLog.unshift({
              source: opponent.name,
              target: o.name,
              dmg: opponent.dmg
            });
            return harm(o, opponent.dmg);
          } else {
            return o;
          }
        });
      });
    });

    characters = characters.filter(o => o.hp.current > 0);

    return {
      ...state,
      ap: 10,
      characters: characters,
      opponents: opponents,
      actions: actions,
      selectedCharacter: state.selectedCharacter
        ? characters.find(c => c.id === state.selectedCharacter.id)
        : null,
      neighbours: state.selectedCharacter
        ? getNeighbors(
            state.selectedCharacter.position,
            characters.concat(opponents).map(o => o.position),
            state.selectedCharacter.steps
          )
        : []
    };
  } else if (command.type === "EXECUTE_ACTION_ON_OPPONENT") {
    const { dmg, ap = 3, dmgType } = command.payload.action;
    const newAP = state.ap - ap;
    state.actionLog.unshift({
      dmgType,
      source: state.selectedCharacter.name,
      target: command.payload.opponent.name,
      dmg: dmg - (command.payload.opponent.armor || 1)
    });
    if (newAP > 0) {
      return {
        ...state,
        ap: state.ap - ap,
        opponents: state.opponents.map(o => {
          if (o.id === command.payload.opponent.id) return harm(o, dmg);
          else return o;
        })
      };
    }
  } else if (command.type === "EXECUTE_ACTION_ON_CHARACTER") {
    const { dmg, dmgType, ap = 3 } = command.payload.action;
    const newAP = state.ap - ap;
    state.actionLog.unshift({
      dmgType,
      source: state.selectedCharacter.name,
      target: command.payload.character.name,
      dmg: dmg
    });
    const newCharacters = state.characters.map(o => {
      if (o.id === command.payload.character.id) {
        if (dmgType === dmgTypes.healing) {
          return heal(o, dmg);
        }
      } else return o;
    });
    if (newAP > 0) {
      return {
        ...state,
        ap: state.ap - ap,
        characters: newCharacters,
        selectedCharacter: state.selectedCharacter
          ? newCharacters.find(c => c.id === state.selectedCharacter.id)
          : null
      };
    }
  }

  return { ...state };
};
export const store = createStore(reducer);
export const getState = store.getState;
export const dispatch = store.dispatch;

const actions = dispatch => ({
  selectTile: position =>
    dispatch({
      type: "SELECT_HEX",
      payload: position
    }),
  selectCharacter: character =>
    dispatch({
      type: "SELECT_CHARACTER",
      payload: character
    }),
  selectOpponent: opponent =>
    dispatch({
      type: "SELECT_OPPONENT",
      payload: opponent
    })
});

export const connectMyComponent = Component =>
  connect(s => s, actions)(Component);
