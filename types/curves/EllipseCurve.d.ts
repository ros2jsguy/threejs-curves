import { Curve } from './../core/Curve';
import { Vector2 } from 'threejs-math';

/**
 * Creates a 2d curve in the shape of an ellipse.
 * Setting the xRadius equal to the yRadius will result in a circle.
 *
 * @example
 * ```
 * const curve = new EllipseCurve(
 *   0,  0,            // ax, aY
 *   10, 10,           // xRadius, yRadius
 *   0,  2 * Math.PI,  // aStartAngle, aEndAngle
 *   false,            // aClockwise
 *   0                 // aRotation
 * );
 *
 * const points = curve.getPoints( 50 );
 * ```
 */
export class EllipseCurve extends Curve<Vector2> {
  /**
   * The print name of the EllipseCurve.
   * @defaultValue 'EllipseCurve'
   */
  readonly type: string;

  /**
   * The X center of the ellipse.
   * @defaultValue 0
   */
  aX: number;

  /**
   * The Y center of the ellipse.
   * @defaultValue 0
   */
  aY: number;

  /**
   * The radius of the ellipse in the x direction.
   * @defaultValue 1
   */
  xRadius: number;

  /**
   * The radius of the ellipse in the y direction.
   * @defaultValue 1
   */
  yRadius: number;


  /**
   * The start angle of the curve in radians starting from the middle right side.
   * @defaultValue 0
   */
  aStartAngle: number;

  /**
   * The end angle of the curve in radians starting from the middle right side.
   * @default 2 * Math.PI
   */
  aEndAngle: number;

  /**
   * Whether the ellipse is drawn clockwise.
   * @defaultValue false
   */
  aClockwise: boolean;

  /**
   * The rotation angle of the ellipse in radians, counterclockwise from the positive X axis
   * @defaultValue 0
   */
  aRotation: number;

  /**
   * @defaultValue true
   */
  readonly isEllipseCurve: boolean;

  /**
   * Create a new instance.
   * @param x – The X center of the ellipse. Default is 0.
   * @param y – The Y center of the ellipse. Default is 0.
   * @param xRadius – The radius of the ellipse in the x direction. Default is 1.
   * @param yRadius – The radius of the ellipse in the y direction. Default is 1.
   * @param startAngle – The start angle of the curve in radians starting from
   *    the positive X axis. Default is 0.
   * @param endAngle – The end angle of the curve in radians starting from the
   *    positive X axis. Default is 2 x Math.PI.
   * @param isClockwise – Whether the ellipse is drawn clockwise. Default is false.
   * @param rotation The rotation angle of the ellipse in radians, counterclockwise
   *    from the positive X axis (optional). Default is 0.
   */
  constructor(
    x?: number,
    y?: number,
    xRadius?: number,
    yRadius?: number,
    startAngle?: number,
    endAngle?: number,
    isClockwise?: boolean,
    rotation?: number,
  );
}
