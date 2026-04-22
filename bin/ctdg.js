#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * ctdg — cypress-test-data-generator CLI.
 *
 * Generates realistic test data outside Cypress — for Jest/Playwright,
 * Storybook, local dev seeding, CI bootstrap scripts, etc.
 *
 * Usage:
 *   ctdg <generator> [--flag value ...] [--count N] [--seed N]
 *                    [--locale LOC] [--pretty] [--output FILE]
 *                    [--format json|jsonl]
 *   ctdg --list
 *   ctdg --help
 */

const fs = require('node:fs');
const path = require('node:path');
const dataGenerator = require('..');

const GENERATORS = [
    'generateUser',
    'generateAddress',
    'generateProduct',
    'generateProductWithRelations',
    'generateOrder',
    'generateReview',
    'generateCategory',
    'generateInventory',
    'generateCoupon',
    'generateShippingMethod',
    'generatePaymentMethod',
    'generateCart',
    'generateWishlist',
    'generateReturn',
    'generateSocialProfile',
    'generateComment',
    'generateNotification',
    'generateMessage',
    'generateCompany',
    'generateInvoice',
    'generateEmployee',
    'generateProject',
    'generateTicket',
    'generateMeeting',
    'generateJobListing',
    'generateCreditCard',
    'generateTransaction',
    'generateBankAccount',
    'generateLoan',
    'generateInsurancePolicy',
    'generateSubscription',
    'generateBlogPost',
    'generateEvent',
    'generateTravelItinerary',
    'generateVehicle',
    'generateProperty',
    'generateRestaurant',
    'generateMenuItem',
    'generateFoodOrder',
    'generateApiResponse',
    'generateLogEntry',
    'generateMedicalRecord',
    'generateEducation',
    'generateScenario',
];

const HELP = `\
ctdg — cypress-test-data-generator CLI

Generate realistic, reproducible test data from the command line.

Usage:
  ctdg <generator> [--flag value ...]
  ctdg --list
  ctdg --help

Common flags:
  --count N           Generate N items (outputs an array). Default: 1.
  --seed N            Deterministic output. Same seed = same data.
  --locale CODE       en | de | fr | es | it | pt_BR | ja | zh_CN | ko | ru (default: en)
  --pretty            Pretty-print JSON with 2-space indent.
  --output, -o FILE   Write to FILE instead of stdout.
  --format FORMAT     "json" (default) or "jsonl" (one JSON value per line).
  --list              Print all available generator names.
  --help, -h          Show this help.

Generator-specific flags:
  generateInventory   --productId STR
  generateScenario    --users N --ordersPerUser N --productsPerOrder N
                      --productsCount N --reviewsPerProduct N

Examples:
  ctdg generateUser
  ctdg generateUser --seed 42 --locale de --pretty
  ctdg generateProduct --count 1000 --seed 1 -o products.json
  ctdg generateScenario --users 3 --ordersPerUser 2 --productsPerOrder 4 --seed 42
  ctdg generateUser --count 500 --format jsonl > users.jsonl
`;

function parseArgs(argv) {
    const positional = [];
    const flags = {};
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--help' || arg === '-h') {
            flags.help = true;
            continue;
        }
        if (arg === '--list') {
            flags.list = true;
            continue;
        }
        if (arg === '--pretty') {
            flags.pretty = true;
            continue;
        }
        if (arg === '-o' || arg === '--output') {
            flags.output = argv[++i];
            continue;
        }
        if (arg.startsWith('--')) {
            const key = arg.slice(2);
            const next = argv[i + 1];
            if (next === undefined || next.startsWith('--')) {
                flags[key] = true;
            } else {
                flags[key] = coerce(next);
                i++;
            }
            continue;
        }
        positional.push(arg);
    }
    return { positional, flags };
}

function coerce(v) {
    if (v === 'true') return true;
    if (v === 'false') return false;
    if (/^-?\d+$/.test(v)) return parseInt(v, 10);
    if (/^-?\d*\.\d+$/.test(v)) return parseFloat(v);
    return v;
}

function fail(msg, exitCode = 1) {
    console.error(`ctdg: ${msg}`);
    console.error('Run `ctdg --help` for usage.');
    process.exit(exitCode);
}

function main() {
    const { positional, flags } = parseArgs(process.argv.slice(2));

    if (flags.help || (positional.length === 0 && !flags.list)) {
        process.stdout.write(HELP);
        process.exit(positional.length === 0 && !flags.list ? 0 : 0);
    }

    if (flags.list) {
        for (const name of GENERATORS) console.log(name);
        process.exit(0);
    }

    const generatorName = positional[0];
    if (!generatorName) fail('missing generator name');
    if (!GENERATORS.includes(generatorName)) {
        fail(`unknown generator "${generatorName}" (try --list)`);
    }

    const gen = dataGenerator();
    const { count, output, pretty, format, productId, ...rest } = flags;

    // Strip CLI-only flags that aren't valid generator options.
    delete rest.help;
    delete rest.list;

    let result;
    try {
        if (generatorName === 'generateInventory') {
            if (count && count > 1) {
                result = Array.from({ length: count }, (_, i) =>
                    gen.generateInventory(productId, {
                        ...rest,
                        seed: rest.seed !== undefined ? rest.seed + i : undefined,
                    })
                );
            } else {
                result = gen.generateInventory(productId, rest);
            }
        } else if (count && count > 1) {
            // Bulk path — re-seed per item so array items are unique yet deterministic.
            result = gen.generateBulk(generatorName, count, rest);
        } else {
            result = gen[generatorName](rest);
        }
    } catch (err) {
        fail(err.message);
    }

    let out;
    const fmt = format || 'json';
    if (fmt === 'jsonl') {
        const arr = Array.isArray(result) ? result : [result];
        out = arr.map((item) => JSON.stringify(item)).join('\n') + '\n';
    } else if (fmt === 'json') {
        out = JSON.stringify(result, null, pretty ? 2 : 0);
        if (!out.endsWith('\n')) out += '\n';
    } else {
        fail(`unknown format "${fmt}" (expected json or jsonl)`);
    }

    if (output) {
        fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
        fs.writeFileSync(output, out);
    } else {
        process.stdout.write(out);
    }
}

main();
