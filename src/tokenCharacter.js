/*
 * Copyright 2018 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-syle
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import PropTypes from "prop-types";
import { Hex } from "./hex";
import { attackTypes, dmgTypes } from "./data/models";
import { ExecuteActionOnCharacter } from "./actions";
import { isIn } from "./positions";

const log = arg => {
  console.log(arg);
  return arg;
};
/**
 * Token
 *
 * Component that represents a board game piece (or token).
 * Can be used by itself or with one of the grid systems
 * provided (Grid or HexGrid).
 *
 * A token renders as a square inside a Grid and a
 * hexagon inside a HexGrid. Additionally, you can pass
 * it a child if you want any other custom rendering.
 *
 * Props:
 *   x       - X coordinate on grid / hex grid.
 *   y       - Y coordinate on grid / hex grid.
 *   z       - Z coordinate on hex grid.
 *   animate - Changes in position are animated if true.
 *   animationDuration - Length of animation.
 *   onClick - Called when the token is clicked.
 *
 * Usage:
 *
 * <Grid rows={8} cols={8}>
 *   <Token x={1} y={2}/>
 * </Grid>
 *
 * <HexGrid>
 *   <Token x={1} y={2} z={-3}/>
 * </HexGrid>
 *
 * <Grid rows={8} cols={8}>
 *   <Token x={1} y={2}>
 *     <Knight color="white"/>
 *   </Token>
 * </Grid>
 */
export class TokenCharacter extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    z: PropTypes.number,
    style: PropTypes.any,
    animate: PropTypes.bool,
    onClick: PropTypes.func,
    onSelectToken: PropTypes.func,
    children: PropTypes.element,
    animationDuration: PropTypes.number,
    _inGrid: PropTypes.bool,
    _inHexGrid: PropTypes.bool
  };

  static defaultProps = {
    animate: true,
    animationDuration: 750
  };

  /**
   * Sets the x and y of the state on creation.
   */
  componentWillMount() {
    this.setState(this.getCoords());
  }

  /**
   * If there is a change in props, saves old x/y,
   * and current time. Starts animation.
   * @param {Object} nextProps Next props.
   */
  componentWillReceiveProps(nextProps) {
    let oldCoord = this.getCoords();
    let newCoord = this.getCoords(nextProps);

    // Debounce.
    if (oldCoord.x === newCoord.x && oldCoord.y === newCoord.y) {
      return;
    } else {
      console.log(oldCoord, newCoord);
    }

    this.setState({
      ...this.state,
      originTime: Date.now(),
      originX: oldCoord.x,
      originY: oldCoord.y,
      originZ: oldCoord.z
    });

    requestAnimationFrame(this._animate(Date.now()));
  }

  /**
   * Recursively animates x and y.
   * @param {number} now Unix timestamp when this was called.
   */
  _animate(now) {
    return () => {
      let elapsed = now - this.state.originTime;
      let svgCoord = this.getCoords();
      if (elapsed < this.props.animationDuration && this.props.animate) {
        const percentage = this._easeInOutCubic(
          elapsed,
          0,
          1,
          this.props.animationDuration
        );

        this.setState({
          ...this.state,
          x:
            (svgCoord.x - this.state.originX) * percentage + this.state.originX,
          y:
            (svgCoord.y - this.state.originY) * percentage + this.state.originY,
          z: (svgCoord.z - this.state.originZ) * percentage + this.state.originZ
        });

        requestAnimationFrame(this._animate(Date.now()));
      } else {
        this.setState({
          ...this.state,
          x: svgCoord.x,
          y: svgCoord.y,
          z: svgCoord.z
        });
      }
    };
  }

  /**
   * Gets SVG x/y/z coordinates.
   * @param {Object} props Props object to get coordinates from.
   * @return {Object} Object with x, y and z parameters.
   */
  getCoords(props = this.props) {
    return {
      x: props.character.position.x,
      y: props.character.position.y,
      z: props.character.position.z
    };
  }

  /**
   * Returns animation easing value. See http://easings.net/#easeInOutCubic.
   * @param {number} t Current time.
   * @param {number} b Beginning value.
   * @param {number} c Final value.
   * @param {number} d Duration.
   */
  _easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  }

  render() {
    const {
      character,
      characters,
      selectedCharacter,
      neighbouringCharacters,
      selectCharacter = () => {}
    } = this.props;
    const isSelected =
      selectedCharacter && character.id === selectedCharacter.id;
    return (
      <Hex
        style={{
          fill: isSelected ? "#831" : "#555"
        }}
        x={this.state.x}
        y={this.state.y}
        z={this.state.z}
        onClick={() => {
          selectCharacter(character);
        }}
      >
        <g>
          <Hex
            style={{ fill: `rgba(100, 50, 200, ${isSelected ? "0.2" : 0})` }}
          />
          <image href={character.image} x="-0.5" y="-0.5" height="1.2" />
          {isSelected ? (
            <Health total={character.hp.total} current={character.hp.current} />
          ) : null}
          {isSelected && (
            <g>
              {character.specials
                .filter(
                  special =>
                    special.dmgType === dmgTypes.healing ||
                    special.attackType !== attackTypes.singleTarget
                )
                .map((special, i) => {
                  // positioning the actions on a circle around the character
                  const cx = Math.sin(45 * i);
                  const cy = Math.cos(45 * i);
                  return (
                    <g key={i}>
                      <image
                        href={`/icons/${special.icon}.png`}
                        x={cx - 0.2}
                        y={cy - 0.2}
                        z="100"
                        height="0.4"
                        onClick={e => {
                          ExecuteActionOnCharacter(special, character);
                          e.stopPropagation();
                        }}
                      />
                    </g>
                  );
                })}
            </g>
          )}
          {!isSelected &&
            selectedCharacter &&
            isIn(character.position, neighbouringCharacters) &&
            selectedCharacter.specials.map((special, i) => {
              if (special.dmgType === dmgTypes.healing) {
                // positioning the actions on a circle around the character
                const cx = Math.sin(45 * i);
                const cy = Math.cos(45 * i);
                return (
                  <g key={i}>
                    <image
                      href={`/icons/${special.icon}.png`}
                      x={cx - 0.2}
                      y={cy - 0.2}
                      z="100"
                      height="0.4"
                      onClick={e => {
                        ExecuteActionOnCharacter(special, character);
                        e.stopPropagation();
                      }}
                    />
                  </g>
                );
              } else {
                return null;
              }
            })}
        </g>
      </Hex>
    );
  }
}

const Health = ({ total, current }) => (
  <g>
    <rect width="0.25" height="1" style={{ fill: "red" }} x="0.25" y="-0.4" />
    <rect
      width="0.25"
      height={1 * (total - current) / total}
      style={{ fill: "rgba(0, 0, 0, 0.5)" }}
      x="0.25"
      y="-0.4"
    />
  </g>
);
