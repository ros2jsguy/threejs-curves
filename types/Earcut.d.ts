/* eslint-disable @typescript-eslint/no-unused-vars */

import { Triangle } from 'threejs-math';

/**
 * An implementation of the earcut polygon triangulation
 * algorithm. The code is a port of
 * [mapbox/earcut](https://github.com/mapbox/earcut).
 */
export namespace Earcut {

  /**
   * Triangulates the given shape definition by returning an
   * array of triangles. A triangle is defined by three
   * consecutive integers representing vertex indices.
   * 
   * @example
   * ```
   * Earcut.triangulate(([10,0, 0,50, 60,60, 70,10]);
   * // returns [1,0,3, 3,2,1]
   * ```
   * @param vertices - A flat array of vertex coordinates like [x0,y0, x1,y1, x2,y2, ...].
   * @param holeIndices - (Optional) An array of hole indices if any,
   *  (e.g. [5, 8] or a 12-vertex input would mean one hole with vertices 5–7 
   *   and another with 8–11).
   * @param dim - The number of coordinates per vertex in the input array. Default is 2.
   * @returns A flat array of triangles where each group of three vertices
   *  indices forms a triangle.
   */
  function triangulate(vertices: number[], holeIndices?: number[], dim?: number): Triangle[];
}
