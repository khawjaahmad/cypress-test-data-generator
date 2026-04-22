/* eslint-disable no-console */
const { performance } = require('node:perf_hooks');
const dataGenerator = require('../src/index');

const WARMUP_ITERATIONS = 500;
const MEASURED_ITERATIONS = 5000;
const BULK_SIZE = 1000;

const gen = dataGenerator();

const targets = [
    { label: 'generateUser', run: () => gen.generateUser() },
    { label: 'generateUser (seeded)', run: () => gen.generateUser({ seed: 42 }) },
    { label: 'generateUser (locale=de)', run: () => gen.generateUser({ locale: 'de' }) },
    { label: 'generateProduct', run: () => gen.generateProduct() },
    { label: 'generateOrder', run: () => gen.generateOrder() },
    { label: 'generateInvoice', run: () => gen.generateInvoice() },
    { label: 'generateCompany', run: () => gen.generateCompany() },
    { label: 'generateTransaction', run: () => gen.generateTransaction() },
    {
        label: `generateBulk user x${BULK_SIZE}`,
        iterations: Math.max(10, Math.floor(MEASURED_ITERATIONS / BULK_SIZE)),
        run: () => gen.generateBulk('generateUser', BULK_SIZE),
    },
];

const measure = (label, run, iterations) => {
    for (let i = 0; i < WARMUP_ITERATIONS; i++) run();

    const start = performance.now();
    for (let i = 0; i < iterations; i++) run();
    const elapsedMs = performance.now() - start;

    const opsPerSec = (iterations / elapsedMs) * 1000;
    const usPerOp = (elapsedMs * 1000) / iterations;
    return { label, iterations, elapsedMs, opsPerSec, usPerOp };
};

const formatNumber = (n) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });
const formatDecimal = (n, digits = 2) => n.toLocaleString('en-US', { maximumFractionDigits: digits });

console.log(`Node ${process.version} | faker ${require('@faker-js/faker/package.json').version}`);
console.log(`Warmup: ${WARMUP_ITERATIONS} | Measured: ${MEASURED_ITERATIONS} (bulk uses fewer iterations)\n`);

const results = targets.map(({ label, run, iterations = MEASURED_ITERATIONS }) =>
    measure(label, run, iterations)
);

const header = '| Generator | Iterations | Total (ms) | ops/sec | µs/op |';
const divider = '|---|---:|---:|---:|---:|';
console.log(header);
console.log(divider);
for (const r of results) {
    console.log(
        `| ${r.label} | ${formatNumber(r.iterations)} | ${formatDecimal(r.elapsedMs)} | ${formatNumber(r.opsPerSec)} | ${formatDecimal(r.usPerOp)} |`
    );
}
