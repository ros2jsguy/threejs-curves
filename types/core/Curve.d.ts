/* eslint-disable @typescript-eslint/member-ordering */
import { Vector, Vector3 } from 'threejs-math';

/**
 * An abstract base class for creating Curve objects that
 * with methods for interpolation.
 */
export class Curve<T extends Vector> {
  /**
   * @default 'Curve'
   */
  readonly type: string;

  /**
   * Determines the amount of divisions when calculating the
   * cumulative segment lengths of a curve via `.getLengths`. To ensure
   * precision when using methods like `.getSpacedPoints`, it is recommended
   * to increase `.arcLengthDivisions` if the curve is very large.
   * @default 200
   */
  arcLengthDivisions: number;

  /**
   * Ceates a new Curve instance.
   */
  constructor();

  /**
   * Find the point (vector) for point t of the curve where t is between 0 and 1.
   * @param t - A position on the curve. Must be in the range [ 0, 1 ].
   * @param optionalTarget - (optional) If specified, the result will
   *    be copied into this Vector, otherwise a new Vector will be created.
   * @return The point.
   */
  getPoint(t: number, optionalTarget?: T): T;

  /**
   * Find a vector for point at relative position in curve according to arc length
   * @param u - A position on the curve according to the arc length. Must be in the range [ 0, 1 ].
   * @param optionalTarget - (optional) If specified, the result will be copied into this Vector,
   *    otherwise a new Vector will be created.
   * @returns The point.
   */
  getPointAt(u: number, optionalTarget?: T): T;

  /**
   * Compute a set of divisions + 1 points using getPoint( t ).
   * @param divisions - number of pieces to divide the curve into. Default is 5.
   * @returns Array of point vectors.
   */
  getPoints(divisions?: number): T[];

  /**
   * Compute a set of divisions + 1 equi-spaced points using getPointAt( u ).
   * @param divisions - number of pieces to divide the curve into. Default is 5.
   * @returns Array of point vectors.
   */
  getSpacedPoints(divisions?: number): T[];

  /**
   * Get total curve arc length.
   * @returns The total arc length.
   */
  getLength(): number;

  /**
   * Get list of cumulative segment lengths.
   * @param divisions 
   * @return Array of points
   */
  getLengths(divisions?: number): number[];

  /**
   * Update the cumlative segment distance cache
   */
  updateArcLengths(): void;

  /**
   * Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance
   */
  getUtoTmapping(u: number, distance: number): number;

  /**
     * Compute a unit vector tangent at t. If the subclassed curve do not
     * implement its tangent derivation, 2 points a small delta apart
     * will be used to find its gradient which seems to give a reasonable
     * approximation getTangent(t: number, optionalTarget?: T): T;
     * @param t - - A position on the curve. Must be in the range [ 0, 1 ].
     * @param optionalTarget — (optional) If specified, the result will be
     *  copied into this Vector, otherwise a new Vector will be created.
     * @returns A vector tangent to t.
     */
  getTangent(t: number, optionalTarget?: T): T;

  /**
   * Returns tangent at equidistance point u on the curve
   * getTangentAt(u: number, optionalTarget?: T): T;
   */
  /**
   * Compute the tangent at a point which is equidistant to the ends of the
   * curve from the point given in `getTangent()`.
   * @param u - A position on the curve according to the arc length.
   *  Must be in the range [ 0, 1 ].
   * @param optionalTarget - (optional) If specified, the result will be
   *  copied into this Vector, otherwise a new Vector will be created.
   * @returns a vector tangent to u.
   */
  getTangentAt(u: number, optionalTarget?: T): T;

  /**
   * Generates the Frenet frames.
   * Learn more at http://www.cs.indiana.edu/pub/techreports/TR425.pdf
   * @param segments - Number of segments
   * @param closed - True if this curve is closed.
   * @returns An object with shape: {
   *   tangents: Vector3[];
   *   normals: Vector3[];
   *   binormals: Vector3[];
   *   }
   */
  computeFrenetFrames(
    segments: number,
    closed?: boolean,
  ): {
    tangents: Vector3[];
    normals: Vector3[];
    binormals: Vector3[];
  };

  /**
   * Creates a new instance with same property values as this curve.
   * @return A new Curve<T> instance exactly like this curve.
   */
  clone(): Curve<T>;

  /**
   * Copies another Curve object's properties to this instance.
   * @param source - The source curve.
   * @returns This instance.
   */
  copy(source: Curve<T>): this;

  /**
   * Create a JSON object representation of this instance.
   * @returns A JSON object
   */
  toJSON(): object;

  /**
   * Copies the data from the given JSON object to this instance.
   * @param json - The source JSON object. 
   * @returns This instance.
   */
  fromJSON(json: object): this;

  // subclasses should override the property
  /**
   * subclass should override
   * @defaultValue false
   */
  readonly isArcCurve: boolean;
  /**
   * subclass should override
   * @defaultValue true
   */
  readonly isCatmullRomCurve3: boolean;
  /**
   * subclass should override
   * @defaultValue false
   */
  readonly isCubicBezierCurve: boolean;
  /**
   * subclass should override
   * @defaultValue false
   */
  readonly isCubicBezierCurve3: boolean;
  /**
   * subclass should override
   * @defaultValue false
   */
  readonly isEllipseCurve: boolean;
  /**
   * subclass should override
   * @defaultValue false
   */
  readonly isLineCurve: boolean;
  /**
   * subclass should override
   * @defaultValue false
   */
  readonly isLineCurve3: boolean;
  /**
   * subclass should override
   * @defaultValue false
   */
  readonly isQuadraticBezierCurve: boolean;
  /**
   * subclass should override
   * @defaultValue false
   */
  readonly isQuadraticBezierCurve3: boolean;
  /**
   * subclass should override
   * @defaultValue false
   */
  readonly isSplineCurve: boolean;
}
