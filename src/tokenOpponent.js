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
import { ExecuteActionOnOpponent } from "./actions";
import { isIn, getNeighbouringOpponents } from "./positions";

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
export class TokenOpponent extends React.Component {
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
      x: props.opponent.position.x,
      y: props.opponent.position.y,
      z: props.opponent.position.z
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
    const { opponent, neighbouringOpponents, selectedCharacter } = this.props;
    return (
      <Hex
        x={this.state.x}
        y={this.state.y}
        z={this.state.z}
        onClick={() => {}}
      >
        <g>
          <g>
            <Hex style={{ fill: "rgba(200, 200, 100, 0.5)" }} />
            <image href={opponent.image} x="-0.5" y="-0.7" height="1.2" />
            <Health total={opponent.hp.total} current={opponent.hp.current} />
            <text y="0.7" x="-0.3" fontSize="0.2">
              {opponent.hp.current}/{opponent.hp.total}
            </text>
          </g>
          {selectedCharacter &&
            isIn(opponent.position, neighbouringOpponents) && (
              <g>
                {selectedCharacter.specials
                  .filter(
                    s =>
                      s.attackType === attackTypes.singleTarget &&
                      s.dmgType !== dmgTypes.healing
                  )
                  .map((special, i) => {
                    // calculate positions on a circle
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
                            ExecuteActionOnOpponent(special, opponent);
                            e.stopPropagation();
                          }}
                        />
                      </g>
                    );
                  })}
              </g>
            )}
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
