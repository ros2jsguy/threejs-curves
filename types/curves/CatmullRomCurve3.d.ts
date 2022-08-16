import { Vector3 } from 'threejs-math';
import { Curve } from './../core/Curve';


/**
 * The CatmullRom parameter family names.
 * 'centripetal' is useful for avoiding
 * cusps and self-intersections in non-uniform catmull rom curves.
 * http://www.cemyuksel.com/research/catmullrom_param/catmullrom.pdf
 */
export type CatmullRomCurveType = 'centripetal' | 'chordal' | 'catmullrom';

/**
 * A smooth 3d spline curve from a series of points using the Catmull-Rom algorithm.
 *
 * References:
 * https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline
 *
 * http://www.cemyuksel.com/research/catmullrom_param/
 *
 * @example
 * ```
 * //Create a closed wavey loop
 * const curve = new THREE.CatmullRomCurve3( [
 *   new THREE.Vector3( -10, 0, 10 ),
 *   new THREE.Vector3( -5, 5, 5 ),
 *   new THREE.Vector3( 0, 0, 0 ),
 *   new THREE.Vector3( 5, -5, 5 ),
 *   new THREE.Vector3( 10, 0, 10 )
 * ] );
 *
 * const points = curve.getPoints( 50 );
 * ```
 */
export class CatmullRomCurve3 extends Curve<Vector3> {
  /**
   * @defaultValue 'CatmullRomCurve3'
   */
  readonly type: string;

  /**
   * @defaultValue true
   */
  readonly isCatmullRomCurve3: boolean;

  /**
   * The array of Vector3 points that define the curve. 
   * It needs at least two entries.
   * @defaultValue []
   */
  points: Vector3[];

  /**
   * The curve will loop back onto itself when this is true.
   */
  closed: boolean;

  /**
   * When curveType is catmullrom, defines catmullrom's tension.
   */
  tension: number;

  /**
   * When curveType is catmullrom, defines catmullrom's tension.
   */
  curveType: CatmullRomCurveType;

  /**
   * @param points - An array of Vector3 points. Default is [].
   * @param isClosed - Whether the curve is closed. Default is false.
   * @param curveType - Curve paramertization name. Default is 'centripetal'.
   * @param tension - Tension of the curve. Default is 0.5.
   */
  constructor(points?: Vector3[], isClosed?: boolean, curveType?: CatmullRomCurveType,
    tension?: number);
}
