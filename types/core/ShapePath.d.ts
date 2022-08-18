import { Color, Vector2 } from 'threejs-math';
import { Path } from './Path';
import { Shape } from './Shape';

/**
 *
 * A Path builder that incrementally converts a series of shapes
 * into an array of Paths. For example an SVG shape to a path.
 */
export class ShapePath {
  /**
   * @defaultValue 'ShapePath'
   */
  readonly type: string;

  /**
   * Color of the shape, by default set to white (0xffffff).
   * @defaultValue new Color()
   */
  color: Color;

  /**
   * Array of Paths.
   * @defaultvalue []
   */
  subPaths: Path[];

  /**
   * The current Path that is being generated.
   * @defaultValue null
   */
  currentPath: Path;

  /**
   * Creates a new ShapePath. Unlike a Path, no points are passed in as the
   * ShapePath is designed to be generated after creation.
   */
  constructor();

  /**
   * Starts a new Path and calls Path.moveTo( x, y ) on that Path.
   * Also points currentPath to that Path.
   * @param x - The target position x coordinate
   * @param y - The target position y coordinate
   * @returns This instance.
   */
  moveTo(x: number, y: number): this;

  /**
   * Add a line from the currentPath offset to X and Y and update the offset to X and Y.
   * @param x - The target position x coordinate
   * @param y - The target position y coordinate
   * @returns This instance.
   */
  lineTo(x: number, y: number): this;

  /**
   * Create a quadratic curve from the currentPath's offset to x and y with
   * cpX and cpY as control point and update the currentPath offset to x and y.
   * @param cpx - The control point x coordinate
   * @param cpy - The control point y coordinate
   * @param x  - The end point x coordinate
   * @param y  - The end point y coordinate
   * @returns This instance.
   */
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): this;

  /**
   * Create a bezier curve from the currentPath offset to x and y with cp1X,
   * cp1Y and cp2X, cp2Y as control points and updates the currentPath
   * offset to x and y.
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
   * Connects a new SplineCurve onto the currentPath.
   * @param pts - An array of Vector2s
   * @returns This instance.
   */
  splineThru(pts: Vector2[]): this;

  /**
   * Converts the subPaths array into an array of Shapes. By default solid
   * shapes are defined clockwise (CW) and holes are defined counterclockwise
   * (CCW). If isCCW is set to true, then those are flipped. If the parameter
   * noHoles is set to true then all paths are set as solid shapes and isCCW
   * is ignored.
   * @param isCCW - Changes how solids and holes are generated
   * @param noHoles - Whether or not to generate holes
   * @returns Array of shapes.
   */
  toShapes(isCCW: boolean, noHoles?: boolean): Shape[];
}
