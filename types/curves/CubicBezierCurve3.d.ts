import { Vector3 } from 'threejs-math';
import { Curve } from './../core/Curve';

/**
 * A smooth 3d cubic bezier curve, defined by a start point,
 * endpoint and two control points.
 * 
 * @example
 * ```
 * const curve = new CubicBezierCurve3(
 *   new Vector3( -10, 0, 0 ),
 *   new Vector3( -5, 15, 0 ),
 *   new Vector3( 20, 15, 0 ),
 *   new Vector3( 10, 0, 0 )
 * );
 *
 * const points = curve.getPoints( 50 );
 * ```
 */
export class CubicBezierCurve3 extends Curve<Vector3> {
  /**
   * @defaultValue 'CubicBezierCurve3'
   */
  readonly type: string;

  /**
   * The starting point.
   * @defaultValue new Vector3()
   */
  v0: Vector3;

  /**
   * The first control point.
   * @defaultValue new Vector3()
   */
  v1: Vector3;

  /**
   * The second control point.
   * @defaultValue new Vector3()
   */
  v2: Vector3;

  /**
   * The ending point.
   * @defaultValue new Vector3()
   */
  v3: Vector3;

  /**
   * @defaultValue true
   */
  readonly isCubicBezierCurve3: boolean;

  /**
   * Create a new instance.
   * @param v0 – The starting point.
   * @param v1 – The first control point.
   * @param v2 – The second control point.
   * @param v3 – The ending point.
   */
  constructor(v0?: Vector3, v1?: Vector3, v2?: Vector3, v3?: Vector3);
}
