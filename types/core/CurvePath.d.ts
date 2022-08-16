import { Curve } from './Curve';
import { Vector } from 'threejs-math';

/**
 * An abstract base class extending Curve.
 * A CurvePath is simply an array of connected curves, but retains the api of a curve.
 */
export class CurvePath<T extends Vector> extends Curve<T> {
  /**
   * @defaultValue 'CurvePath'
   */
  readonly type: string;

  /**
   * The array of Curves.
   * @defaultValue []
   */
  curves: Array<Curve<T>>;

  /**
   * Whether or not to automatically close the path.
   * @defaultValue false
   */
  autoClose: boolean;

  /**
   * Add a curve to the curves array.
   * @param curve - The curve to add.
   */
  add(curve: Curve<T>): void;

  /**
   * Adds a lineCurve to close the path if start and end of
   * lines are not connected.
   */
  closePath(): void;

  /**
   * Get list of cumulative curve lengths of this instance curves.
   * @returns The lengths of each curve.
   */
  getCurveLengths(): number[];

  /**
   * Compute a set of divisions + 1 points using getPoint( t ).
   * @param divisions - number of pieces to divide the curve into. Default is 12.
   * @returns Array of point vectors.
   */
  getPoints(divisions?: number): T[];

  /**
   * Compute a set of divisions + 1 equi-spaced points using getPointAt( u ).
   * @param divisions - number of pieces to divide the curve into. Default is 40.
   * @returns Array of point vectors.
   */
  getSpacedPoints(divisions?: number): T[];
}
