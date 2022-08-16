import { Vector2 } from 'threejs-math';
import { Curve } from './../core/Curve';

/**
 * A smooth 2d quadratic bezier curve, defined by a startpoint,
 * endpoint and a single control point.
 */
export class QuadraticBezierCurve extends Curve<Vector2> {
  /**
   * The print name of the QuadraticBezierCurve.
   * @defaultValue 'QuadraticBezierCurve'
   */
  readonly type: string;

  /**
   * The startpoint.
   */
  v0: Vector2;

  /**
   * The control point.
   */
  v1: Vector2;

  /**
   *The endpoint.
   */
  v2: Vector2;

  /**
   * @defaultValue true
   */
  readonly isQuadraticBezierCurve: boolean;

  /**
   * Create a new instance.
   * @param v0 – The starting point
   * @param v1 – The middle control point
   * @param v2 – The ending point
   */
  constructor(v0?: Vector2, v1?: Vector2, v2?: Vector2);
}
