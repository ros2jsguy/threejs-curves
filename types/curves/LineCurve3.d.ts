import { Vector3 } from 'threejs-math';
import { Curve } from './../core/Curve';

/**
 * A curve representing a 3d line segment.
 */
export class LineCurve3 extends Curve<Vector3> {
  /**
   * The print name of the LineCurve3.
   * @defaultValue 'LineCurve3'
   */
  readonly type: string;

  /**
   * The start point.
   */
  v1: Vector3;

  /**
   * The end point.
   */
  v2: Vector3;

  /**
   * @defaultValue true
   */
  readonly isLineCurve3: boolean;

  /**
   * Create a new LineCurve3 instance.
   * @param v1 - The start point.
   * @param v2 - The end point.
   */
  constructor(v1?: Vector3, v2?: Vector3);
}
