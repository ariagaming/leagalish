import React from "react";
import { render } from "react-dom";
import "./styles/main.css";
import "./styles/card.css";
import { Provider } from "react-redux";
import { store, connectMyComponent } from "./reducer";
import { HexGrid } from "./hex";
import { Token } from "./token";
import { TokenCharacter } from "./tokenCharacter";
import { TokenOpponent } from "./tokenOpponent";
import { TokenMovement } from "./tokenMovement";
import * as Actions from "./actions";
import { Row, Column } from "./layout";
import { CharacterCard } from "./cards/character";

/* eslint-disable no-unused-vars */
const log = arg => {
  console.log(arg);
  return arg;
};

const colorMap = {
  //"-3,3,0": "red"
};

const showText = position => `${position.x},${position.y},${position.z}`;

const Board = connectMyComponent(
  ({
    ap,
    actionLog = [],
    characters = [],
    neighbours = [],
    opponents = [],
    selectedCharacter,
    selectTile,
    selectCharacter,
    selectOpponent,
    hover
  }) => {
    neighbours = neighbours || [];
    return (
      <div className="board-container">
        <div>
          {neighbours.length + opponents.length + characters.length > 0 ? (
            <HexGrid levels={6} colorMap={colorMap} onClick={arg => {}}>
              <RenderChildren
                characters={characters}
                opponents={opponents}
                neighbours={neighbours}
              />
            </HexGrid>
          ) : null}
        </div>

        <div style={{ position: "fixed", bottom: 0, left: 0, padding: "1rem" }}>
          <h1>{ap}</h1>
          <div>
            <button onClick={() => Actions.ResetBoard()}>Reset</button>
          </div>
          <div>
            <button onClick={() => Actions.EndTurn()}>End Turn</button>
          </div>
          {hover && (
            <div>
              x:{hover.x}, y:{hover.y}, z:{hover.z}
            </div>
          )}
        </div>

        {selectedCharacter && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              right: 0,
              background: "transparent",
              padding: "1rem"
            }}
          >
            <CharacterCard character={selectedCharacter} />
          </div>
        )}
        <div
          className="action-log"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            background: "rgba(255, 255, 255, 0.5)",
            color: "black",
            border: "1px solid grey",
            borderRadius: "5px",
            margin: "0.5rem",
            padding: "1rem",
            maxHeight: "150px",
            overflow: "auto"
          }}
        >
          {actionLog.map(({ source, target, dmg, dmgType }, i) => (
            <div key={i} style={{ lineHeight: "30px" }}>
              {dmgType && (
                <img height="30" src={`/images/${dmgType}.png`} alt={dmgType} />
              )}
              <span style={{}}>
                {source}:{target}:{dmg}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

const RenderChildren = connectMyComponent(
  ({
    characters = [],
    neighbours = [],
    opponents = [],
    neighbouringCharacters = [],
    neighbouringOpponents = [],
    selectedCharacter,
    selectTile,
    selectCharacter,
    selectOpponent,
    hover
  }) =>
    neighbours
      .filter(c => c)
      .map((neighbour, i) => (
        <TokenMovement
          key={i}
          x={neighbour.x}
          y={neighbour.y}
          z={neighbour.z}
          style={{ fill: "rgba(255, 150, 150, 0.5)" }}
          onSelectToken={() => {
            selectTile(neighbour);
          }}
        />
      ))
      .concat(
        opponents
          .filter(c => c)
          .map((opponent, i) => (
            <TokenOpponent
              opponent={opponent}
              characters={characters}
              neighbouringOpponents={neighbouringOpponents}
              selectedCharacter={selectedCharacter}
              key={i + 100}
              onSelect={() => selectedCharacter && selectOpponent(opponent)}
            />
          ))
      )
      .concat(
        characters.filter(c => c).map((character, i) => {
          return (
            <TokenCharacter
              character={character}
              characters={characters}
              key={i + 200}
              selectedCharacter={selectedCharacter}
              selectCharacter={selectCharacter}
              neighbouringCharacters={neighbouringCharacters}
            />
          );
        })
      )
);

const App = () => (
  <Provider store={store}>
    <Board />
  </Provider>
);

render(<App />, document.getElementById("root"));

/*

else {
                return (
                  <TokenMovement
                    key={i}
                    x={character.x}
                    y={character.y}
                    z={character.z}
                    style={{ fill: "rgba(255, 150, 150, 0.5)" }}
                    onSelectToken={() => {
                      selectTile(character);
                    }}
                  />
                );
              }

              */
