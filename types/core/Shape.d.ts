import { Vector2 } from 'threejs-math';
import { Path } from './Path';

/**
 * An arbitrary 2d shape plane using paths with optional holes.
 *
 * @example
 * ```
 * const heartShape = new THREE.Shape();
 *
 * heartShape.moveTo( 25, 25 );
 * heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
 * heartShape.bezierCurveTo( - 30, 0, - 30, 35, - 30, 35 );
 * heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
 * heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
 * heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
 * heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );
 * ```
 */
export class Shape extends Path {
  /**
   * @defaultValue 'Shape'
   */
  readonly type: string;

  /**
   * UUID of this instance. This gets automatically assigned, so this shouldn't be edited.
   */
  readonly uuid: string;

  /**
   * An array of paths that define the holes in the shape.
   * @defaultValue []
   */
  holes: Path[];

  /**
   * Creates a Shape from the points. The first point defines the offset,
   * then successive points are added to the curves array as LineCurves.
   *
   * If no points are specified, an empty shape is created and the
   * currentPoint is set to the origin.
   * @param points - (optional) array of Vector2.
   */
  constructor(points?: Vector2[]);

  /**
   * Get an array of Vector2s that represent the holes in the shape.
   * @param divisions - The fineness of the result.
   * @returns An array of Vector2 arrays, each row is a hole.
   */
  getPointsHoles(divisions: number): Vector2[][];

  /**
   * Get the points on the shape and the holes array as an object.
   * @param divisions - The fineness of the result.
   * @returns An object with the following shape: {
   *   shape: Vector2[];
   *   holes: Vector2[];
   * }
   */
  extractPoints(divisions: number): {
    shape: Vector2[];
    holes: Vector2[][];
  };
}
