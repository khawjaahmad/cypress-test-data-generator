#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * release-local — bump to a release-candidate version and npm pack.
 *
 * Produces a tarball in the repo root that can be installed into any
 * consumer project to exercise the plugin before a real `npm publish`.
 *
 * Bump rules:
 *   <major>.<minor>.<patch>          → <major>.<minor+1>.0-rc.0
 *   <major>.<minor>.<patch>-rc.<N>   → <major>.<minor>.<patch>-rc.<N+1>
 *
 * Usage:
 *   npm run release:local
 *
 * Flags:
 *   --no-bump    Skip the version bump; just pack what's in package.json.
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const args = new Set(process.argv.slice(2));
const skipBump = args.has('--no-bump');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const readPkg = () => JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const before = readPkg().version;

if (!skipBump) {
    const isAlreadyRc = /-rc\.\d+$/.test(before);
    const cmd = isAlreadyRc
        ? 'npm version prerelease --no-git-tag-version'
        : 'npm version preminor --preid=rc --no-git-tag-version';
    console.log(`• Bumping version (${before} → ...) via \`${cmd}\``);
    execSync(cmd, { stdio: 'ignore' });
}

const after = readPkg().version;
console.log(`• Version: ${after}`);

console.log('• Packing…');
const packOutput = execSync('npm pack', { encoding: 'utf8' }).trim();
// npm pack prints its notices to stderr; stdout is the filename(s)
const tarballName = packOutput.split('\n').pop().trim();
const tarballPath = path.resolve(path.dirname(pkgPath), tarballName);

if (!fs.existsSync(tarballPath)) {
    console.error(`! expected tarball at ${tarballPath} but it wasn't created`);
    process.exit(1);
}

const size = fs.statSync(tarballPath).size;
const sizeKb = (size / 1024).toFixed(1);

console.log('');
console.log(`  Pack ready: ${tarballPath} (${sizeKb} kB)`);
console.log('');
console.log('  Install in your consumer project:');
console.log('');
console.log(`    npm install --save-dev "${tarballPath}"`);
console.log('');
console.log('  Don\'t forget the peers the plugin needs at test time:');
console.log('');
console.log('    npm install --save-dev cypress zod');
console.log('');
