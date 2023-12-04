import path from 'node:path';
import { copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.join(__dirname, '..');

/**
 * @param {string} destination
 * @returns {import('esbuild').Plugin}
 */
export function copyPackageAssetsPlugin(destination) {
	return {
		name: 'copy-package-assets',
		setup(build) {
			build.onEnd(() => {
				const files = ['LICENSE', 'README.md'];
				for (const file of files) {
					const src = path.join(ROOT_DIR, file);
					const dest = path.join(destination, file);
					copyFileSync(src, dest);
				}
			});
		},
	};
}

/**
 * @param {string} destination
 * @returns {import('esbuild').Plugin}
 */
export function generateTsDeclarationPlugin(destination) {
	throw new Error('Not implemented');
	return {
		name: 'generate-ts-declaration',
		setup(build) {
			build.onEnd((res) => {});
		},
	};
}

/** @param {import('../package.json')} pkgJson */
export function getCommonPkgJsonFields(pkgJson) {
	return {
		version: pkgJson.version,
		license: pkgJson.license,
		author: pkgJson.author,
		repository: pkgJson.repository,
	};
}
