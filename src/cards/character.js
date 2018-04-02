import React from "react";
import { Row, Column } from "./../layout";
import { dmgTypes } from "./../data/models";
const log = arg => {
  console.log(arg);
  return arg;
};

export const CharacterCard = ({ character }) => (
  <div className="card">
    <Column>
      <Row>
        <div className="card--image" style={{ flex: "1 0" }}>
          <img src={character.image} height="120" alt={character.name} />
        </div>
        <Column style={{ flex: "2 0", paddingLeft: "0.5rem" }}>
          <div
            style={{
              fontWeight: "bold",
              whiteSpace: "nowrap",
              marginBottom: "0.5rem"
            }}
          >
            {character.name}
          </div>
          <div>
            <strong>DMG: </strong>
            <img
              width="15"
              style={{ verticalAlign: "middle", marginRight: "3px" }}
              src={`/images/${character.dmgType}.png`}
              alt={character.dmgType}
            />
            <span style={{ verticalAlign: "middle" }}>{character.dmg}</span>
          </div>
          <div>
            <strong>HP:</strong>
            <span>
              {" "}
              {character.hp.current}/{character.hp.total}
            </span>
          </div>
          <div>
            <strong>Armor:</strong>
            <span> {character.armor}</span>
          </div>
        </Column>
      </Row>
      <hr style={{ margin: "0.5rem -1rem 0 -1rem" }} />
      <div className="card-special">
        {character.specials.map((special, i) => (
          <Row key={i} style={{ padding: "1rem 1rem 0 1rem" }}>
            <img
              height="44"
              src={`/icons/${special.icon}.png`}
              alt={special.icon}
              style={{ margin: "9px 10px 0 0" }}
            />
            <Column>
              <div
                style={{ fontWeight: "bold", height: "22px", marginTop: "6px" }}
              >
                <span style={{ lineHeight: "27px", verticalAlign: "middle" }}>
                  {special.name}
                </span>
                <img
                  width="15"
                  style={{ verticalAlign: "middle", marginLeft: "3px" }}
                  src={`/images/${special.attackType}.png`}
                  alt={special.attackType}
                />
              </div>
              <div style={{ height: "27px" }}>
                {special.dmgType !== "NONE" && (
                  <img
                    width="15"
                    style={{ verticalAlign: "middle", marginRight: "3px" }}
                    src={`/images/${special.dmgType}.png`}
                    alt={special.dmgType}
                  />
                )}
                {special.dmgType !== dmgTypes.none ? (
                  <span style={{ lineHeight: "27px", verticalAlign: "middle" }}>
                    {special.dmg} dmg
                  </span>
                ) : (
                  <p>{special.description}</p>
                )}
              </div>
            </Column>
          </Row>
        ))}
      </div>
    </Column>
  </div>
);
