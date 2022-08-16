import { Vector2 } from 'threejs-math';
import { CurvePath } from './CurvePath';

/**
 * A 2d path representation including methods for creating paths and
 * contours of 2D shapes.
 *
 * @example
 * ```
 * const path = new THREE.Path();
 *
 * path.lineTo( 0, 0.8 );
 * path.quadraticCurveTo( 0, 1, 0.2, 1 );
 * path.lineTo( 1, 1 );
 *
 * const points = path.getPoints();
 * ```
 */
export class Path extends CurvePath<Vector2> {
  /**
   * @defaultValue 'Path'
   */
  readonly type: string;

  /**
   * The current offset of the path. Any new Curve added will start here.
   * @defaultValue new THREE.Vector2()
   */
  currentPoint: Vector2;

  /**
   * Create a new instance from the points. The first point defines the offset,
   * then successive points are added to the curves array as LineCurves.
   * If no points are specified, an empty path is created and the
   * currentPoint is set to the origin.
   * @param points - (optional) array of Vector2s.
   */
  constructor(points?: Vector2[]);

  /**
   * Points are added to the curves array as LineCurves.
   * @param vectors - array of Vector2.
   * @returns This instance.
   */
  setFromPoints(vectors: Vector2[]): this;

  /**
   * Move the the currentPoint to x, y position.
   * @param x - new point, x coordinate
   * @param y - new point, y coordinate
   * @returns This instance.
   */
  moveTo(x: number, y: number): this;

  /**
   * Connects a LineCurve from the currentPoint to x, y onto the path.
   * @param x - end point, x coordinate
   * @param y - end point, y coordinate
   * @returns This instance.
   */
  lineTo(x: number, y: number): this;

  /**
   * Creates a quadratic curve from the currentPoint with cpX and cpY
   * as control point and updates the currentPoint to x and y.
   * @param cpx - Control point, x coordinate
   * @param cpy - Control point, y coordinate
   * @param x - End point, x coordinate
   * @param y - End point, y coordinate
   * @returns This instance.
   */
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this;

  /**
   * Creates a bezier curve from currentPoint with (cp1X, cp1Y) and (cp2X, cp2Y)
   * as control points and updates currentPoint to the end point (x,y).
   * @param cp1x - Control point1, x coordinate
   * @param cp1y - Control point1, y coordinate
   * @param cp2x - Control point2, x coordinate
   * @param cp2y - Control point2, y coordinate
   * @param x - end point, x coordinate
   * @param y - end point, y coordinate
   * @returns This instance.
   */
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): this;

  /**
   * Connects a new SplineCurve onto the path.
   * @param pts - - An array of Vector2
   * @returns This instance.
   */
  splineThru(pts: Vector2[]): this;

  /**
   * Adds an EllipseCurve to the path, positioned relative to the currentPoint.
   * @param x - The absolute center x of the arc. Default is 0.
   * @param y - The absolute center y of the arc. Default is 0.
   * @param radius - The radius of the arc. Default is 1.
   * @param startAngle - The start angle of the curve in radians starting from
   *    the positive X axis. Default is 0.
   * @param endAngle - The end angle of the curve in radians starting from the
   *    positive X axis. Default is 2 x Math.PI.
   * @param isClockwise - Sweep the arc clockwise. Defaults to false.
   * @returns This instance.
   */
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number,
    isClockwise: boolean): this;

  /**
   * Adds an absolutely positioned EllipseCurve to the path.
   * @param x - The absolute center x of the arc. Default is 0.
   * @param y - The absolute center y of the arc. Default is 0.
   * @param radius - The radius of the arc. Default is 1.
   * @param startAngle - The start angle of the curve in radians starting from
   *    the positive X axis. Default is 0.
   * @param endAngle - The end angle of the curve in radians starting from the
   *    positive X axis. Default is 2 x Math.PI.
   * @param isClockwise - Sweep the arc clockwise. Defaults to false.
   * @returns This instance.
   */
  absarc(x?: number, y?: number, radius?: number, startAngle?: number,
    endAngle?: number, isClockwise?: boolean): this;

  /**
   * Adds an EllipseCurve to the path, positioned relative to the currentPoint.
   * @param x - The center of the ellipse offset from the last call.
   * @param y - The center of the ellipse offset from the last call.
   * @param xRadius - The radius of the ellipse in the x axis.
   * @param yRadius - The radius of the ellipse in the y axis.
   * @param startAngle - The start angle in radians.
   * @param endAngle - The end angle in radians.
   * @param isClockwise - Sweep the ellipse clockwise. Defaults to false.
   * @param rotation - The rotation angle of the ellipse in radians,
   *    counterclockwise from the positive X axis. Optional, defaults to 0.
   * @returns This instance.
   */
  ellipse(
    x: number,
    y: number,
    xRadius: number,
    yRadius: number,
    startAngle: number,
    endAngle: number,
    isClockwise: boolean,
    rotation: number,
  ): this;

  /**
   * Adds an absolutely positioned EllipseCurve to the path.
   * @param x – The X center of the ellipse. Default is 0.
   * @param y – The Y center of the ellipse. Default is 0.
   * @param xRadius – The radius of the ellipse in the x direction. Default is 1.
   * @param yRadius – The radius of the ellipse in the y direction. Default is 1.
   * @param radius - The radius of the arc. Default is 1.
   * @param startAngle - The start angle of the curve in radians starting from
   *    the positive X axis. Default is 0.
   * @param endAngle - The end angle of the curve in radians starting from the
   *    positive X axis. Default is 2 x Math.PI.
   * @param isClockwise - Sweep the arc clockwise. Defaults to false.
   * @returns This instance.
   */
  absellipse(
    x: number,
    y: number,
    xRadius: number,
    yRadius: number,
    startAngle: number,
    endAngle: number,
    isClockwise: boolean,
    rotation: number,
  ): this;
}
