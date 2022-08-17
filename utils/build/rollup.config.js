import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import babelrc from './.babelrc.json';

function babelCleanup() {

	const doubleSpaces = / {2}/g;

	return {

		transform( code ) {

			code = code.replace( doubleSpaces, '\t' );

			return {
				code: code,
				map: null
			};

		}

	};

}


let builds = [
	{
		input: 'src/extras/index.js',
		output: [
			{
				format: 'esm',
				file: 'build/threejs-curves.module.js'
			}
		]
	},
	{
		input: 'src/extras/index.js',
		plugins: [
			babel( {
				babelHelpers: 'bundled',
				compact: false,
				babelrc: false,
				...babelrc
			} ),
			babelCleanup()
		],
		output: [
			{
				format: 'cjs',
				name: 'THREE',
				file: 'build/threejs-curves.cjs',
				indent: '\t'
			}
		]
	}
];


if ( process.env.ONLY_MODULE === 'true' ) {

	builds = builds[ 0 ];

}

export default builds;
