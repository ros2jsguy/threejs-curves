'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var threeMathTs = require('@ros2jsguy/three-math-ts');

function helloWorld() {
	console.log('hello world');
}

/**
 * Port from https://github.com/mapbox/earcut (v2.2.2)
 */
const Earcut = {
	triangulate: function (data, holeIndices, dim = 2) {
		const hasHoles = holeIndices && holeIndices.length;
		const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
		let outerNode = linkedList(data, 0, outerLen, dim, true);
		const triangles = [];
		if (!outerNode || outerNode.next === outerNode.prev) return triangles;
		let minX, minY, maxX, maxY, x, y, invSize;
		if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim); // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox

		if (data.length > 80 * dim) {
			minX = maxX = data[0];
			minY = maxY = data[1];

			for (let i = dim; i < outerLen; i += dim) {
				x = data[i];
				y = data[i + 1];
				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (x > maxX) maxX = x;
				if (y > maxY) maxY = y;
			} // minX, minY and invSize are later used to transform coords into integers for z-order calculation


			invSize = Math.max(maxX - minX, maxY - minY);
			invSize = invSize !== 0 ? 1 / invSize : 0;
		}

		earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
		return triangles;
	}
}; // create a circular doubly linked list from polygon points in the specified winding order

function linkedList(data, start, end, dim, clockwise) {
	let i, last;

	if (clockwise === signedArea(data, start, end, dim) > 0) {
		for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
	} else {
		for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
	}

	if (last && equals(last, last.next)) {
		removeNode(last);
		last = last.next;
	}

	return last;
} // eliminate colinear or duplicate points


function filterPoints(start, end) {
	if (!start) return start;
	if (!end) end = start;
	let p = start,
			again;

	do {
		again = false;

		if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
			removeNode(p);
			p = end = p.prev;
			if (p === p.next) break;
			again = true;
		} else {
			p = p.next;
		}
	} while (again || p !== end);

	return end;
} // main ear slicing loop which triangulates a polygon (given as a linked list)


function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
	if (!ear) return; // interlink polygon nodes in z-order

	if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
	let stop = ear,
			prev,
			next; // iterate through ears, slicing them one by one

	while (ear.prev !== ear.next) {
		prev = ear.prev;
		next = ear.next;

		if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
			// cut off the triangle
			triangles.push(prev.i / dim);
			triangles.push(ear.i / dim);
			triangles.push(next.i / dim);
			removeNode(ear); // skipping the next vertex leads to less sliver triangles

			ear = next.next;
			stop = next.next;
			continue;
		}

		ear = next; // if we looped through the whole remaining polygon and can't find any more ears

		if (ear === stop) {
			// try filtering points and slicing again
			if (!pass) {
				earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1); // if this didn't work, try curing all small self-intersections locally
			} else if (pass === 1) {
				ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
				earcutLinked(ear, triangles, dim, minX, minY, invSize, 2); // as a last resort, try splitting the remaining polygon into two
			} else if (pass === 2) {
				splitEarcut(ear, triangles, dim, minX, minY, invSize);
			}

			break;
		}
	}
} // check whether a polygon node forms a valid ear with adjacent nodes


function isEar(ear) {
	const a = ear.prev,
				b = ear,
				c = ear.next;
	if (area(a, b, c) >= 0) return false; // reflex, can't be an ear
	// now make sure we don't have other points inside the potential ear

	let p = ear.next.next;

	while (p !== ear.prev) {
		if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
		p = p.next;
	}

	return true;
}

function isEarHashed(ear, minX, minY, invSize) {
	const a = ear.prev,
				b = ear,
				c = ear.next;
	if (area(a, b, c) >= 0) return false; // reflex, can't be an ear
	// triangle bbox; min & max are calculated like this for speed

	const minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x,
				minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y,
				maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x,
				maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y; // z-order range for the current triangle bbox;

	const minZ = zOrder(minTX, minTY, minX, minY, invSize),
				maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
	let p = ear.prevZ,
			n = ear.nextZ; // look for points inside the triangle in both directions

	while (p && p.z >= minZ && n && n.z <= maxZ) {
		if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
		p = p.prevZ;
		if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
		n = n.nextZ;
	} // look for remaining points in decreasing z-order


	while (p && p.z >= minZ) {
		if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
		p = p.prevZ;
	} // look for remaining points in increasing z-order


	while (n && n.z <= maxZ) {
		if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
		n = n.nextZ;
	}

	return true;
} // go through all polygon nodes and cure small local self-intersections


function cureLocalIntersections(start, triangles, dim) {
	let p = start;

	do {
		const a = p.prev,
					b = p.next.next;

		if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
			triangles.push(a.i / dim);
			triangles.push(p.i / dim);
			triangles.push(b.i / dim); // remove two nodes involved

			removeNode(p);
			removeNode(p.next);
			p = start = b;
		}

		p = p.next;
	} while (p !== start);

	return filterPoints(p);
} // try splitting polygon into two and triangulate them independently


function splitEarcut(start, triangles, dim, minX, minY, invSize) {
	// look for a valid diagonal that divides the polygon into two
	let a = start;

	do {
		let b = a.next.next;

		while (b !== a.prev) {
			if (a.i !== b.i && isValidDiagonal(a, b)) {
				// split the polygon in two by the diagonal
				let c = splitPolygon(a, b); // filter colinear points around the cuts

				a = filterPoints(a, a.next);
				c = filterPoints(c, c.next); // run earcut on each half

				earcutLinked(a, triangles, dim, minX, minY, invSize);
				earcutLinked(c, triangles, dim, minX, minY, invSize);
				return;
			}

			b = b.next;
		}

		a = a.next;
	} while (a !== start);
} // link every hole into the outer loop, producing a single-ring polygon without holes


function eliminateHoles(data, holeIndices, outerNode, dim) {
	const queue = [];
	let i, len, start, end, list;

	for (i = 0, len = holeIndices.length; i < len; i++) {
		start = holeIndices[i] * dim;
		end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
		list = linkedList(data, start, end, dim, false);
		if (list === list.next) list.steiner = true;
		queue.push(getLeftmost(list));
	}

	queue.sort(compareX); // process holes from left to right

	for (i = 0; i < queue.length; i++) {
		eliminateHole(queue[i], outerNode);
		outerNode = filterPoints(outerNode, outerNode.next);
	}

	return outerNode;
}

function compareX(a, b) {
	return a.x - b.x;
} // find a bridge between vertices that connects hole with an outer ring and link it


function eliminateHole(hole, outerNode) {
	outerNode = findHoleBridge(hole, outerNode);

	if (outerNode) {
		const b = splitPolygon(outerNode, hole); // filter collinear points around the cuts

		filterPoints(outerNode, outerNode.next);
		filterPoints(b, b.next);
	}
} // David Eberly's algorithm for finding a bridge between hole and outer polygon


function findHoleBridge(hole, outerNode) {
	let p = outerNode;
	const hx = hole.x;
	const hy = hole.y;
	let qx = -Infinity,
			m; // find a segment intersected by a ray from the hole's leftmost point to the left;
	// segment's endpoint with lesser x will be potential connection point

	do {
		if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
			const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);

			if (x <= hx && x > qx) {
				qx = x;

				if (x === hx) {
					if (hy === p.y) return p;
					if (hy === p.next.y) return p.next;
				}

				m = p.x < p.next.x ? p : p.next;
			}
		}

		p = p.next;
	} while (p !== outerNode);

	if (!m) return null;
	if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint
	// look for points inside the triangle of hole point, segment intersection and endpoint;
	// if there are no points found, we have a valid connection;
	// otherwise choose the point of the minimum angle with the ray as connection point

	const stop = m,
				mx = m.x,
				my = m.y;
	let tanMin = Infinity,
			tan;
	p = m;

	do {
		if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
			tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

			if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
				m = p;
				tanMin = tan;
			}
		}

		p = p.next;
	} while (p !== stop);

	return m;
} // whether sector in vertex m contains sector in vertex p in the same coordinates


function sectorContainsSector(m, p) {
	return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
} // interlink polygon nodes in z-order


function indexCurve(start, minX, minY, invSize) {
	let p = start;

	do {
		if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
		p.prevZ = p.prev;
		p.nextZ = p.next;
		p = p.next;
	} while (p !== start);

	p.prevZ.nextZ = null;
	p.prevZ = null;
	sortLinked(p);
} // Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html


function sortLinked(list) {
	let i,
			p,
			q,
			e,
			tail,
			numMerges,
			pSize,
			qSize,
			inSize = 1;

	do {
		p = list;
		list = null;
		tail = null;
		numMerges = 0;

		while (p) {
			numMerges++;
			q = p;
			pSize = 0;

			for (i = 0; i < inSize; i++) {
				pSize++;
				q = q.nextZ;
				if (!q) break;
			}

			qSize = inSize;

			while (pSize > 0 || qSize > 0 && q) {
				if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
					e = p;
					p = p.nextZ;
					pSize--;
				} else {
					e = q;
					q = q.nextZ;
					qSize--;
				}

				if (tail) tail.nextZ = e;else list = e;
				e.prevZ = tail;
				tail = e;
			}

			p = q;
		}

		tail.nextZ = null;
		inSize *= 2;
	} while (numMerges > 1);

	return list;
} // z-order of a point given coords and inverse of the longer side of data bbox


function zOrder(x, y, minX, minY, invSize) {
	// coords are transformed into non-negative 15-bit integer range
	x = 32767 * (x - minX) * invSize;
	y = 32767 * (y - minY) * invSize;
	x = (x | x << 8) & 0x00FF00FF;
	x = (x | x << 4) & 0x0F0F0F0F;
	x = (x | x << 2) & 0x33333333;
	x = (x | x << 1) & 0x55555555;
	y = (y | y << 8) & 0x00FF00FF;
	y = (y | y << 4) & 0x0F0F0F0F;
	y = (y | y << 2) & 0x33333333;
	y = (y | y << 1) & 0x55555555;
	return x | y << 1;
} // find the leftmost node of a polygon ring


function getLeftmost(start) {
	let p = start,
			leftmost = start;

	do {
		if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y) leftmost = p;
		p = p.next;
	} while (p !== start);

	return leftmost;
} // check if a point lies within a convex triangle


function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
	return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
} // check if a diagonal between two polygon nodes is valid (lies in polygon interior)


function isValidDiagonal(a, b) {
	return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && ( // doesn't intersect other edges
	locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && ( // locally visible
	area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
	equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
} // signed area of a triangle


function area(p, q, r) {
	return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
} // check if two points are equal


function equals(p1, p2) {
	return p1.x === p2.x && p1.y === p2.y;
} // check if two segments intersect


function intersects(p1, q1, p2, q2) {
	const o1 = sign(area(p1, q1, p2));
	const o2 = sign(area(p1, q1, q2));
	const o3 = sign(area(p2, q2, p1));
	const o4 = sign(area(p2, q2, q1));
	if (o1 !== o2 && o3 !== o4) return true; // general case

	if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1

	if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1

	if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2

	if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

	return false;
} // for collinear points p, q, r, check if point q lies on segment pr


function onSegment(p, q, r) {
	return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

function sign(num) {
	return num > 0 ? 1 : num < 0 ? -1 : 0;
} // check if a polygon diagonal intersects any polygon segments


function intersectsPolygon(a, b) {
	let p = a;

	do {
		if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) return true;
		p = p.next;
	} while (p !== a);

	return false;
} // check if a polygon diagonal is locally inside the polygon


function locallyInside(a, b) {
	return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
} // check if the middle point of a polygon diagonal is inside the polygon


function middleInside(a, b) {
	let p = a,
			inside = false;
	const px = (a.x + b.x) / 2,
				py = (a.y + b.y) / 2;

	do {
		if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) inside = !inside;
		p = p.next;
	} while (p !== a);

	return inside;
} // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring


function splitPolygon(a, b) {
	const a2 = new Node(a.i, a.x, a.y),
				b2 = new Node(b.i, b.x, b.y),
				an = a.next,
				bp = b.prev;
	a.next = b;
	b.prev = a;
	a2.next = an;
	an.prev = a2;
	b2.next = a2;
	a2.prev = b2;
	bp.next = b2;
	b2.prev = bp;
	return b2;
} // create a node and optionally link it with previous one (in a circular doubly linked list)


function insertNode(i, x, y, last) {
	const p = new Node(i, x, y);

	if (!last) {
		p.prev = p;
		p.next = p;
	} else {
		p.next = last.next;
		p.prev = last;
		last.next.prev = p;
		last.next = p;
	}

	return p;
}

function removeNode(p) {
	p.next.prev = p.prev;
	p.prev.next = p.next;
	if (p.prevZ) p.prevZ.nextZ = p.nextZ;
	if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

function Node(i, x, y) {
	// vertex index in coordinates array
	this.i = i; // vertex coordinates

	this.x = x;
	this.y = y; // previous and next vertex nodes in a polygon ring

	this.prev = null;
	this.next = null; // z-order curve value

	this.z = null; // previous and next nodes in z-order

	this.prevZ = null;
	this.nextZ = null; // indicates whether this is a steiner point

	this.steiner = false;
}

function signedArea(data, start, end, dim) {
	let sum = 0;

	for (let i = start, j = end - dim; i < end; i += dim) {
		sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
		j = i;
	}

	return sum;
}

class ShapeUtils {
	// calculate area of the contour polygon
	static area(contour) {
		const n = contour.length;
		let a = 0.0;

		for (let p = n - 1, q = 0; q < n; p = q++) {
			a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
		}

		return a * 0.5;
	}

	static isClockWise(pts) {
		return ShapeUtils.area(pts) < 0;
	}

	static triangulateShape(contour, holes) {
		const vertices = []; // flat array of vertices like [ x0,y0, x1,y1, x2,y2, ... ]

		const holeIndices = []; // array of hole indices

		const faces = []; // final array of vertex indices like [ [ a,b,d ], [ b,c,d ] ]

		removeDupEndPts(contour);
		addContour(vertices, contour); //

		let holeIndex = contour.length;
		holes.forEach(removeDupEndPts);

		for (let i = 0; i < holes.length; i++) {
			holeIndices.push(holeIndex);
			holeIndex += holes[i].length;
			addContour(vertices, holes[i]);
		} //


		const triangles = Earcut.triangulate(vertices, holeIndices); //

		for (let i = 0; i < triangles.length; i += 3) {
			faces.push(triangles.slice(i, i + 3));
		}

		return faces;
	}

}

function removeDupEndPts(points) {
	const l = points.length;

	if (l > 2 && points[l - 1].equals(points[0])) {
		points.pop();
	}
}

function addContour(vertices, contour) {
	for (let i = 0; i < contour.length; i++) {
		vertices.push(contour[i].x);
		vertices.push(contour[i].y);
	}
}

/* eslint-disable spaced-comment */
/**
 * Extensible curve object.
 *
 * Some common of curve methods:
 * .getPoint( t, optionalTarget ), .getTangent( t, optionalTarget )
 * .getPointAt( u, optionalTarget ), .getTangentAt( u, optionalTarget )
 * .getPoints(), .getSpacedPoints()
 * .getLength()
 * .updateArcLengths()
 *
 * This following curves inherit from THREE.Curve:
 *
 * -- 2D curves --
 * THREE.ArcCurve
 * THREE.CubicBezierCurve
 * THREE.EllipseCurve
 * THREE.LineCurve
 * THREE.QuadraticBezierCurve
 * THREE.SplineCurve
 *
 * -- 3D curves --
 * THREE.CatmullRomCurve3
 * THREE.CubicBezierCurve3
 * THREE.LineCurve3
 * THREE.QuadraticBezierCurve3
 *
 * A series of curves can be represented as a THREE.CurvePath.
 *
 **/

class Curve {
	constructor() {
		this.type = 'Curve';
		this.arcLengthDivisions = 200;
	} // Virtual base class method to overwrite and implement in subclasses
	//	- t [0 .. 1]


	getPoint() {
		console.warn('THREE.Curve: .getPoint() not implemented.');
		return null;
	} // Get point at relative position in curve according to arc length
	// - u [0 .. 1]


	getPointAt(u, optionalTarget) {
		const t = this.getUtoTmapping(u);
		return this.getPoint(t, optionalTarget);
	} // Get sequence of points using getPoint( t )


	getPoints(divisions = 5) {
		const points = [];

		for (let d = 0; d <= divisions; d++) {
			points.push(this.getPoint(d / divisions));
		}

		return points;
	} // Get sequence of points using getPointAt( u )


	getSpacedPoints(divisions = 5) {
		const points = [];

		for (let d = 0; d <= divisions; d++) {
			points.push(this.getPointAt(d / divisions));
		}

		return points;
	} // Get total curve arc length


	getLength() {
		const lengths = this.getLengths();
		return lengths[lengths.length - 1];
	} // Get list of cumulative segment lengths


	getLengths(divisions = this.arcLengthDivisions) {
		if (this.cacheArcLengths && this.cacheArcLengths.length === divisions + 1 && !this.needsUpdate) {
			return this.cacheArcLengths;
		}

		this.needsUpdate = false;
		const cache = [];
		let current,
				last = this.getPoint(0);
		let sum = 0;
		cache.push(0);

		for (let p = 1; p <= divisions; p++) {
			current = this.getPoint(p / divisions);
			sum += current.distanceTo(last);
			cache.push(sum);
			last = current;
		}

		this.cacheArcLengths = cache;
		return cache; // { sums: cache, sum: sum }; Sum is in the last element.
	}

	updateArcLengths() {
		this.needsUpdate = true;
		this.getLengths();
	} // Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant


	getUtoTmapping(u, distance) {
		const arcLengths = this.getLengths();
		let i = 0;
		const il = arcLengths.length;
		let targetArcLength; // The targeted u distance value to get

		if (distance) {
			targetArcLength = distance;
		} else {
			targetArcLength = u * arcLengths[il - 1];
		} // binary search for the index with largest value smaller than target u distance


		let low = 0,
				high = il - 1,
				comparison;

		while (low <= high) {
			i = Math.floor(low + (high - low) / 2); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

			comparison = arcLengths[i] - targetArcLength;

			if (comparison < 0) {
				low = i + 1;
			} else if (comparison > 0) {
				high = i - 1;
			} else {
				high = i;
				break; // DONE
			}
		}

		i = high;

		if (arcLengths[i] === targetArcLength) {
			return i / (il - 1);
		} // we could get finer grain at lengths, or use simple interpolation between two points


		const lengthBefore = arcLengths[i];
		const lengthAfter = arcLengths[i + 1];
		const segmentLength = lengthAfter - lengthBefore; // determine where we are between the 'before' and 'after' points

		const segmentFraction = (targetArcLength - lengthBefore) / segmentLength; // add that fractional amount to t

		const t = (i + segmentFraction) / (il - 1);
		return t;
	} // Returns a unit vector tangent at t
	// In case any sub curve does not implement its tangent derivation,
	// 2 points a small delta apart will be used to find its gradient
	// which seems to give a reasonable approximation


	getTangent(t, optionalTarget) {
		const delta = 0.0001;
		let t1 = t - delta;
		let t2 = t + delta; // Capping in case of danger

		if (t1 < 0) t1 = 0;
		if (t2 > 1) t2 = 1;
		const pt1 = this.getPoint(t1);
		const pt2 = this.getPoint(t2);
		const tangent = optionalTarget || (pt1.isVector2 ? new threeMathTs.Vector2() : new threeMathTs.Vector3());
		tangent.copy(pt2).sub(pt1).normalize();
		return tangent;
	}

	getTangentAt(u, optionalTarget) {
		const t = this.getUtoTmapping(u);
		return this.getTangent(t, optionalTarget);
	}

	computeFrenetFrames(segments, closed) {
		// see http://www.cs.indiana.edu/pub/techreports/TR425.pdf
		const normal = new threeMathTs.Vector3();
		const tangents = [];
		const normals = [];
		const binormals = [];
		const vec = new threeMathTs.Vector3();
		const mat = new threeMathTs.Matrix4(); // compute the tangent vectors for each segment on the curve

		for (let i = 0; i <= segments; i++) {
			const u = i / segments;
			tangents[i] = this.getTangentAt(u, new threeMathTs.Vector3());
		} // select an initial normal vector perpendicular to the first tangent vector,
		// and in the direction of the minimum tangent xyz component


		normals[0] = new threeMathTs.Vector3();
		binormals[0] = new threeMathTs.Vector3();
		let min = Number.MAX_VALUE;
		const tx = Math.abs(tangents[0].x);
		const ty = Math.abs(tangents[0].y);
		const tz = Math.abs(tangents[0].z);

		if (tx <= min) {
			min = tx;
			normal.set(1, 0, 0);
		}

		if (ty <= min) {
			min = ty;
			normal.set(0, 1, 0);
		}

		if (tz <= min) {
			normal.set(0, 0, 1);
		}

		vec.crossVectors(tangents[0], normal).normalize();
		normals[0].crossVectors(tangents[0], vec);
		binormals[0].crossVectors(tangents[0], normals[0]); // compute the slowly-varying normal and binormal vectors for each segment on the curve

		for (let i = 1; i <= segments; i++) {
			normals[i] = normals[i - 1].clone();
			binormals[i] = binormals[i - 1].clone();
			vec.crossVectors(tangents[i - 1], tangents[i]);

			if (vec.length() > Number.EPSILON) {
				vec.normalize();
				const theta = Math.acos(threeMathTs.MathUtils.clamp(tangents[i - 1].dot(tangents[i]), -1, 1)); // clamp for floating pt errors

				normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta));
			}

			binormals[i].crossVectors(tangents[i], normals[i]);
		} // if the curve is closed, postprocess the vectors so the first and last normal vectors are the same


		if (closed === true) {
			let theta = Math.acos(threeMathTs.MathUtils.clamp(normals[0].dot(normals[segments]), -1, 1));
			theta /= segments;

			if (tangents[0].dot(vec.crossVectors(normals[0], normals[segments])) > 0) {
				theta = -theta;
			}

			for (let i = 1; i <= segments; i++) {
				// twist a little...
				normals[i].applyMatrix4(mat.makeRotationAxis(tangents[i], theta * i));
				binormals[i].crossVectors(tangents[i], normals[i]);
			}
		}

		return {
			tangents: tangents,
			normals: normals,
			binormals: binormals
		};
	}

	clone() {
		return new this.constructor().copy(this);
	}

	copy(source) {
		this.arcLengthDivisions = source.arcLengthDivisions;
		return this;
	}

	toJSON() {
		const data = {
			metadata: {
				version: 4.5,
				type: 'Curve',
				generator: 'Curve.toJSON'
			}
		};
		data.arcLengthDivisions = this.arcLengthDivisions;
		data.type = this.type;
		return data;
	}

	fromJSON(json) {
		this.arcLengthDivisions = json.arcLengthDivisions;
		return this;
	}

}

exports.Curve = Curve;
exports.Earcut = Earcut;
exports.ShapeUtils = ShapeUtils;
exports.helloWorld = helloWorld;
