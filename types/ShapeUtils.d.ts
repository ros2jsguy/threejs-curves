/* eslint-disable @typescript-eslint/no-unused-vars */

import { Vector2 } from "threejs-math";

/**
 * An object with x & y numeric properties similar to a Vector2.
 */
export interface Vector2Data {
  x: number;
  y: number;
}

/**
 * Utility functions for working with shapes.
 *
 * Note that these are all linear functions so it is necessary to
 * calculate separately for x, y (and z, w if present) components of a vector.
 */
export namespace ShapeUtils {

  /**
   * Calculate area of a ( 2D ) contour polygon.
   * @param contour - 2D polygon. An array of Vector2().
   * @returns The area value.
   */
  function area(contour: Vector2Data[]): number;

  /**
   * Perform triangulation of a (2D) contour polygon with holes.
   * 
   * @example
   * ```
   * ShapeUtils.triangulateShape( [
   *   new Vector2(10,0),  // 0
   *   new Vector2(0,50),  // 1
   *   new Vector2(60,60), // 2
   *   new Vector2(70,10)  // 3
   * ], [])
   * // [ [ 1, 0, 3 ], [ 3, 2, 1 ] ]
   * ```
   * @param contour - 2D polygon. An array of Vector2.
   * @param holes - 0 or more hole polygons. An array that
   *  holds arrays of Vector2s. Each array represents a single hole definition.
   * @returns The triangles over the contour (number[][3]).
   *  Each row is a triangle represented as a number[3] array
   *  where each value is an index in the contour array.
   */
  function triangulateShape(contour: Vector2[], holes: Vector2[][]): number[][];

  /**
   * Determine if an array of points are ordered to create a 
   * clockwise path.
   *
   * Note that this is a linear function so it is
   * necessary to calculate separately for x, y
   * components of a polygon.
   * @param pts - points defining a 2D polygon
   * @returns True if points are clockwise ordered.
   */
  function isClockWise(pts: Vector2Data[]): boolean;
}
