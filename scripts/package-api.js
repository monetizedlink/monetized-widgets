import path from 'node:path';
import { rmSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';
import pkgJson from '../package.json' assert { type: 'json' };
import {
	ROOT_DIR,
	copyPackageAssetsPlugin,
	getCommonPkgJsonFields,
} from './utils.js';

const SRC_DIR = path.join(ROOT_DIR, 'src', 'lib');
const OUT_DIR = path.join(ROOT_DIR, 'output', 'api');
rmSync(OUT_DIR, { recursive: true, force: true });

void build({
	outdir: OUT_DIR,
	entryPoints: [
		path.join(SRC_DIR, 'api.ts'),
		path.join(SRC_DIR, 'monetized-link', 'check.js'),
	],
	bundle: false,
	tsconfig: path.join(ROOT_DIR, 'tsconfig.json'),
	platform: 'neutral',
	packages: 'external',
	format: 'esm',
	sourcemap: true,
	minify: false,
	color: true,
	metafile: true,
	logLevel: 'info',
	plugins: [writePackageJsonPlugin(), copyPackageAssetsPlugin(OUT_DIR)],
});

/** @returns {import('esbuild').Plugin} */
function writePackageJsonPlugin() {
	return {
		name: 'writePackageJson',
		setup(build) {
			build.onEnd((res) => {
				const result = {
					...getCommonPkgJsonFields(pkgJson),
					name: '@monetized/api',
					type: 'module',
					dependencies: {},
					exports: {
						'.': {
							default: './api.js',
						},
						'./monetized-link': {
							default: './monetized-link/check.js',
						},
					},
				};
				const dependencies = new Set(
					Object.values(res.metafile.outputs)
						.flatMap((e) => e.imports.map((e) => e.path))
						.filter((s) => pkgJson.dependencies[s]),
				);
				result.dependencies = Object.fromEntries(
					[...dependencies].map((e) => [e, pkgJson.dependencies[e]]),
				);
				writeFileSync(
					path.join(OUT_DIR, 'package.json'),
					JSON.stringify(result, null, 2),
				);
			});
		},
	};
}
