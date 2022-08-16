import { Vector2 } from 'threejs-math';
import { Curve } from './../core/Curve';

/**
 * A curve representing a 2d line segment.
 */
export class LineCurve extends Curve<Vector2> {
  /**
   * The print name of the LineCurve.
   * @defaultvalue 'LineCurve'
   */
  readonly type: string;

  /**
   * The start point.
   */
  v1: Vector2;

  /**
     * The end point.
     */
  v2: Vector2;

  /**
   * @defaultValue true
   */
  readonly isLineCurve: boolean;

  /**
   * Create a new LineCurve3 instance.
   * @param v1 - The start point.
   * @param v2 - The end point.
   */
  constructor(v1?: Vector2, v2?: Vector2);
}
