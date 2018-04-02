import { dispatch } from "./reducer";

export const EndTurn = () =>
  dispatch({
    type: "END_TURN"
  });

export const Harm = id => {
  dispatch({
    type: "HARM",
    payload: id
  });
};

export const AttackOpponents = id => {
  dispatch({
    type: "ATTACK_OPPONENTS",
    payload: id
  });
};

export const ExecuteActionOnOpponent = (action, opponent) => {
  dispatch({
    type: "EXECUTE_ACTION_ON_OPPONENT",
    payload: {
      action,
      opponent
    }
  });
};

export const ExecuteActionOnCharacter = (action, character) => {
  dispatch({
    type: "EXECUTE_ACTION_ON_CHARACTER",
    payload: {
      action,
      character
    }
  });
};

export const ResetBoard = () => dispatch({ type: "RESET_BOARD" });
