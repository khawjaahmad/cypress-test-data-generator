/* eslint-disable no-console */
// CLI smoke test. Spawns bin/ctdg.js in several modes and asserts the
// shape of what comes back. Catches "broken CLI" regressions without
// depending on cypress.

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const BIN = path.resolve(__dirname, '..', 'bin', 'ctdg.js');

let failures = 0;
function assert(label, cond, detail = '') {
    if (cond) {
        console.log(`  OK   ${label}`);
    } else {
        failures++;
        console.error(`  FAIL ${label}${detail ? `\n       ${detail}` : ''}`);
    }
}

function run(args, { allowFail = false } = {}) {
    const result = spawnSync('node', [BIN, ...args], { encoding: 'utf8' });
    if (!allowFail && result.status !== 0) {
        throw new Error(
            `ctdg ${args.join(' ')} exited ${result.status}: ${result.stderr}`
        );
    }
    return result;
}

console.log('cli:smoke — ctdg');

// --help
const help = run(['--help']);
assert('--help exits 0', help.status === 0);
assert('--help output mentions Usage', /Usage:/.test(help.stdout));

// --list
const list = run(['--list']);
assert('--list exits 0', list.status === 0);
const names = list.stdout.trim().split('\n');
assert(
    `--list contains at least 40 generators (got ${names.length})`,
    names.length >= 40
);
assert('--list includes generateScenario', names.includes('generateScenario'));

// generateUser default (one item)
const user = run(['generateUser', '--seed', '42']);
const userObj = JSON.parse(user.stdout);
assert('generateUser produces object with firstName', typeof userObj.firstName === 'string');

// generateUser --seed deterministic across runs
const userA = JSON.parse(run(['generateUser', '--seed', '42']).stdout);
const userB = JSON.parse(run(['generateUser', '--seed', '42']).stdout);
assert('--seed is deterministic', userA.id === userB.id);

// generateUser --count N
const bulk = JSON.parse(run(['generateUser', '--count', '5', '--seed', '1']).stdout);
assert('--count 5 returns an array of 5', Array.isArray(bulk) && bulk.length === 5);
assert(
    '--count 5 items have unique ids',
    new Set(bulk.map((u) => u.id)).size === 5
);

// --format jsonl
const jsonl = run(['generateProduct', '--count', '3', '--seed', '1', '--format', 'jsonl']);
const lines = jsonl.stdout.trim().split('\n');
assert('jsonl has 3 lines', lines.length === 3);
assert('each jsonl line parses as JSON', lines.every((l) => {
    try { JSON.parse(l); return true; } catch { return false; }
}));

// --output writes to file
const tmpFile = path.join(os.tmpdir(), `ctdg-smoke-${Date.now()}.json`);
run(['generateUser', '--count', '10', '--seed', '1', '-o', tmpFile]);
const fileContent = fs.readFileSync(tmpFile, 'utf8');
const fileJson = JSON.parse(fileContent);
assert(`--output writes 10 users to ${tmpFile}`, fileJson.length === 10);
fs.unlinkSync(tmpFile);

// generateScenario with FK integrity
const scenario = JSON.parse(
    run([
        'generateScenario',
        '--users', '3',
        '--ordersPerUser', '2',
        '--productsPerOrder', '4',
        '--reviewsPerProduct', '1',
        '--seed', '42',
    ]).stdout
);
assert('scenario has 3 users', scenario.users.length === 3);
assert('scenario has 6 orders', scenario.orders.length === 6);
const userIds = new Set(scenario.users.map((u) => u.id));
assert(
    'every order.userId references a real user (FK integrity)',
    scenario.orders.every((o) => userIds.has(o.userId))
);
const productIds = new Set(scenario.products.map((p) => p.id));
assert(
    'every review.productId references a real product',
    scenario.reviews.every((r) => productIds.has(r.productId))
);

// generateInventory --productId
const inv = JSON.parse(run(['generateInventory', '--productId', 'p-42']).stdout);
assert('generateInventory --productId is propagated', inv.productId === 'p-42');

// unknown generator exits 1
const bad = run(['generateDoesNotExist'], { allowFail: true });
assert('unknown generator exits non-zero', bad.status !== 0);
assert(
    'unknown generator error mentions --list',
    /try --list/.test(bad.stderr)
);

// locale passthrough
const germanUser = JSON.parse(run(['generateUser', '--seed', '1', '--locale', 'de']).stdout);
assert('locale produces user object', typeof germanUser.id === 'string');

if (failures > 0) {
    console.error(`\n${failures} failure(s).`);
    process.exit(1);
} else {
    console.log(`\nAll CLI smoke checks passed.`);
}
