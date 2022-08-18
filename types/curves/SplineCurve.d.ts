import { Vector2 } from 'threejs-math';
import { Curve } from './../core/Curve';

/**
 * Create a smooth 2d spline curve from a series of points.
 * Internally this uses Interpolations.CatmullRom to create the curve.
 *
 * @example
 * ```
 * // Create a sine-like wave
 * const curve = new SplineCurve( [
 *   new Vector2( -10, 0 ),
 *   new Vector2( -5, 5 ),
 *   new Vector2( 0, 0 ),
 *   new Vector2( 5, -5 ),
 *   new Vector2( 10, 0 )
 * ] );
 *
 * const points = curve.getPoints( 50 );
 * ```
 */
export class SplineCurve extends Curve<Vector2> {
  /**
   * The print name of the SplineCurve.
   * @defaultValue 'SplineCurve'
   */
  readonly type: string;

  /**
   * The array of Vector2 points that define the curve.
   * @defaultValue []
   */
  points: Vector2[];

  /**
   * @defaultValue true
   */
  readonly isSplineCurve: boolean;

  /**
   * Create a new SplineCurve instance.
   * @param points - The points that define the curve.
   */
  constructor(points?: Vector2[]);
}
