import { EllipseCurve } from './EllipseCurve';

/**
 * Alias for EllipseCurve.
 */
export class ArcCurve extends EllipseCurve {
  /**
   * @defaultValue 'ArcCurve'
  */
  readonly type: string;

  /**
   * @defaultValue true
   */
  readonly isArcCurve: boolean;

  /**
   * Create a new instance.
   * @param x – The X center of the ellipse. Default is 0.
   * @param y – The Y center of the ellipse. Default is 0.
   * @param radius – The radius of the ellipse in the x and y direction. Default is 1.
   * @param startAngle – The start angle of the curve in radians starting from
   *    the positive X axis. Default is 0.
   * @param endAngle – The end angle of the curve in radians starting from the
   *    positive X axis. Default is 2 x Math.PI.
   * @param isClockwise – Whether the ellipse is drawn clockwise. Default is false.
   */
  constructor(
    x?: number,
    y?: number,
    radius?: number,
    startAngle?: number,
    endAngle?: number,
    islockwise?: boolean
  );
}
