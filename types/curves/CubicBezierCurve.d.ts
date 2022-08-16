import { Vector2 } from 'threejs-math';
import { Curve } from './../core/Curve';

/**
 * A smooth 2d cubic bezier curve, defined by a start point, endpoint
 * and two control points.
 *
 * @example
 * ```
 * const curve = new THREE.CubicBezierCurve(
 *   new THREE.Vector2( -10, 0 ),
 *   new THREE.Vector2( -5, 15 ),
 *   new THREE.Vector2( 20, 15 ),
 *   new THREE.Vector2( 10, 0 )
 * );
 *
 * const points = curve.getPoints( 50 );
 * ```
 */
export class CubicBezierCurve extends Curve<Vector2> {
  /**
   * @defaultValue 'CubicBezierCurve'
   */
  readonly type: string;

  /**
   * The starting point.
   * @defaultValue new THREE.Vector2()
   */
  v0: Vector2;

  /**
   * The first control point.
   * @defaultValue new THREE.Vector2()
   */
  v1: Vector2;

  /**
   * The second control point.
   * @defaultValue new THREE.Vector2()
   */
  v2: Vector2;

  /**
   * The end point.
   * @defaultValue new THREE.Vector2()
   */
  v3: Vector2;

  /**
   * @defaultValue true
   */
  readonly isCubicBezierCurve: boolean;

  /**
   * Create a new instance.
   * @param v0 - The starting point.
   * @param v1 – The first control point.
   * @param v2 - The second control point.
   * @param v3 - The ending point.
   */
  constructor(v0?: Vector2, v1?: Vector2, v2?: Vector2, v3?: Vector2);
}
