const { createPluginSystem, initFaker } = require('./utils/faker-utils');
const { validatePositiveInteger } = require('./utils/validators');

const {
    createUserGenerators,
    createEcommerceGenerators,
    createSocialGenerators,
    createBusinessGenerators,
    createFinanceGenerators,
    createContentGenerators,
    createTravelGenerators,
    createRealEstateGenerators,
    createFoodGenerators,
    createTechnicalGenerators,
    createHealthcareGenerators,
    createScenarioGenerator
} = require('./generators');

/**
 * Create the plugin. Returns an object containing every generator method
 * plus `registerPlugin`, `setSeed`, `setLocale`, and `generateBulk`.
 */
function dataGenerator(_on, _config) {
    const { registerPlugin, applyPlugins } = createPluginSystem();

    let currentSeed = null;
    let currentLocale = 'en';

    const setSeed = (seed) => {
        if (seed !== undefined && seed !== null) {
            const numericSeed = typeof seed === 'string' ? parseInt(seed, 10) : seed;
            if (!isNaN(numericSeed)) {
                currentSeed = numericSeed;
            }
        }
    };

    const setLocale = (locale) => {
        if (locale) {
            currentLocale = locale;
        }
    };

    const generator = {
        registerPlugin,
        setSeed,
        setLocale,

        generateBulk(generateFunc, count, options = {}) {
            validatePositiveInteger(count, 'count');

            const fn = typeof generateFunc === 'string'
                ? generator[generateFunc]
                : generateFunc;

            if (typeof fn !== 'function') {
                throw new Error('generateFunc must be a function or valid generator method name');
            }

            return Array.from({ length: count }, (_, index) => {
                const itemOptions = options.seed
                    ? { ...options, seed: options.seed + index }
                    : options;
                return fn.call(generator, itemOptions);
            });
        },

        ...createUserGenerators(applyPlugins),
        ...createEcommerceGenerators(applyPlugins),
        ...createSocialGenerators(applyPlugins),
        ...createBusinessGenerators(applyPlugins),
        ...createFinanceGenerators(applyPlugins),
        ...createContentGenerators(applyPlugins),
        ...createTravelGenerators(applyPlugins),
        ...createRealEstateGenerators(applyPlugins),
        ...createFoodGenerators(applyPlugins),
        ...createTechnicalGenerators(applyPlugins),
        ...createHealthcareGenerators(applyPlugins),
    };

    // generateScenario composes other generators so it must be attached
    // after the base `generator` object has been constructed.
    Object.assign(generator, createScenarioGenerator(applyPlugins, generator));

    return generator;
}

// Adapters for tasks whose signatures don't match the usual `(options)` shape.
const TASK_SIGNATURES = {
    generateInventory: (args, gen) =>
        gen.generateInventory(args && args.productId, args && args.options),
    generateBulk: (args, gen) =>
        gen.generateBulk(
            args && args.generator,
            args && args.count,
            args && args.options
        ),
};

const PASSTHROUGH_TASKS = [
    'generateUser',
    'generateAddress',
    'generateProduct',
    'generateProductWithRelations',
    'generateOrder',
    'generateReview',
    'generateCategory',
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

/**
 * Register every generator as a cy.task in a single call.
 *
 * @example
 *   // cypress.config.js
 *   const dataGenerator = require('cypress-test-data-generator');
 *   module.exports = defineConfig({
 *     e2e: {
 *       setupNodeEvents(on, config) {
 *         dataGenerator.registerTasks(on, config);
 *         return config;
 *       }
 *     }
 *   });
 */
function registerTasks(on, config) {
    const gen = dataGenerator(on, config);
    const tasks = {};

    for (const name of PASSTHROUGH_TASKS) {
        tasks[name] = (options) => gen[name](options);
    }
    for (const [name, adapter] of Object.entries(TASK_SIGNATURES)) {
        tasks[name] = (args) => adapter(args, gen);
    }

    on('task', tasks);
    return gen;
}

dataGenerator.registerTasks = registerTasks;

module.exports = dataGenerator;
