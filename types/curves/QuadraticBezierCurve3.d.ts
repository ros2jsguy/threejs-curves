import { Vector3 } from 'threejs-math';
import { Curve } from './../core/Curve';

/**
 * A smooth 3d quadratic bezier curve, defined by a startpoint,
 * endpoint and a single control point.
 */
export class QuadraticBezierCurve3 extends Curve<Vector3> {
  /**
   * The print name of the QuadraticBezierCurve3.
   * @defaultValue 'QuadraticBezierCurve3'
   */
  readonly type: string;

  /**
   * The startpoint.
   */
  v0: Vector3;

  /**
   * The control point.
   */
  v1: Vector3;

  /**
   *The endpoint.
   */
  v2: Vector3;

  /**
   * @defaultValue true
   */
  readonly isQuadraticBezierCurve3: boolean;

  /**
   * Create a new instance.
   * @param v0 – The starting point
   * @param v1 – The middle control point
   * @param v2 – The ending point
   */
  constructor(v0?: Vector3, v1?: Vector3, v2?: Vector3);
}
