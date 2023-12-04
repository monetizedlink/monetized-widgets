import path from 'node:path';
import { readdirSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';
import pkgJson from '../package.json' assert { type: 'json' };
import {
	ROOT_DIR,
	copyPackageAssetsPlugin,
	getCommonPkgJsonFields,
} from './utils.js';

/** @type {Array<{ match: (basename: string) => boolean, destination: string }>} */
const config = [
	{
		match: (p) => p.startsWith('monetized-link-riser.') && p.endsWith('.js'),
		destination: 'monetized-link-riser',
	},
	{
		match: (p) => p.startsWith('MonetizedLinkRiser') && p.endsWith('.js'),
		destination: 'MonetizedLinkRiser',
	},
];

const SRC_DIR = path.join(ROOT_DIR, 'build', '_app', 'immutable', 'chunks');
const OUT_DIR = path.join(ROOT_DIR, 'output', 'widgets');

rmSync(OUT_DIR, { recursive: true, force: true });
const files = readdirSync(SRC_DIR);

const entryPoints = config.map((entry) => {
	const inputFile = files.find((f) => entry.match(f));
	if (!inputFile) {
		throw new Error(`Failed to find match for "${entry.destination}"`);
	}
	return {
		in: path.join(SRC_DIR, inputFile),
		out: entry.destination,
	};
});

void build({
	entryPoints: entryPoints,
	outdir: OUT_DIR,
	bundle: true,
	platform: 'browser',
	format: 'esm',
	sourcemap: true,
	minify: true,
	color: true,
	logLevel: 'info',
	plugins: [writePackageJsonPlugin(), copyPackageAssetsPlugin(OUT_DIR)],
});

/** @returns {import('esbuild').Plugin} */
function writePackageJsonPlugin() {
	return {
		name: 'writePackageJson',
		setup(build) {
			build.onEnd(() => {
				const result = {
					name: '@monetized/widgets',
					...getCommonPkgJsonFields(pkgJson),
					type: 'module',
					dependencies: {},
				};
				writeFileSync(
					path.join(OUT_DIR, 'package.json'),
					JSON.stringify(result, null, 2),
				);
				console.log('Wrote package.json', result.version);
			});
		},
	};
}
