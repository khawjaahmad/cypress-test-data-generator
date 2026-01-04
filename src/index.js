const { createPluginSystem, initFaker } = require('./utils/faker-utils');
const { validatePositiveInteger } = require('./utils/validators');

// Import all generator creators
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
    createHealthcareGenerators
} = require('./generators');

/**
 * Cypress Test Data Generator Plugin
 * Generates realistic test data using Faker.js
 *
 * @param {Object} _on - Cypress event listener (reserved for future use)
 * @param {Object} _config - Cypress config (reserved for future use)
 * @returns {Object} Generator object with all data generation methods
 */
function dataGenerator(_on, _config) {
    // Create plugin system
    const pluginSystem = createPluginSystem();
    const { registerPlugin, applyPlugins } = pluginSystem;

    // Seed and locale management
    let currentSeed = null;
    let currentLocale = 'en';

    /**
     * Set the random seed for reproducible data
     * @param {number|string} seed - Seed value
     */
    const setSeed = (seed) => {
        if (seed !== undefined && seed !== null) {
            const numericSeed = typeof seed === 'string' ? parseInt(seed, 10) : seed;
            if (!isNaN(numericSeed)) {
                currentSeed = numericSeed;
            }
        }
    };

    /**
     * Set the locale for data generation
     * @param {string} locale - Locale code (e.g., 'en', 'de', 'fr')
     */
    const setLocale = (locale) => {
        if (locale) {
            currentLocale = locale;
        }
    };

    // Initialize all generators with plugin system
    const userGenerators = createUserGenerators(applyPlugins);
    const ecommerceGenerators = createEcommerceGenerators(applyPlugins);
    const socialGenerators = createSocialGenerators(applyPlugins);
    const businessGenerators = createBusinessGenerators(applyPlugins);
    const financeGenerators = createFinanceGenerators(applyPlugins);
    const contentGenerators = createContentGenerators(applyPlugins);
    const travelGenerators = createTravelGenerators(applyPlugins);
    const realEstateGenerators = createRealEstateGenerators(applyPlugins);
    const foodGenerators = createFoodGenerators(applyPlugins);
    const technicalGenerators = createTechnicalGenerators(applyPlugins);
    const healthcareGenerators = createHealthcareGenerators(applyPlugins);

    // Combine all generators
    const generator = {
        // Core utilities
        registerPlugin,
        setSeed,
        setLocale,

        /**
         * Generate bulk data using a generator function
         * @param {Function|string} generateFunc - Generator function or method name
         * @param {number} count - Number of items to generate
         * @param {Object} options - Options to pass to generator
         * @returns {Array} Array of generated items
         */
        generateBulk(generateFunc, count, options = {}) {
            validatePositiveInteger(count, 'count');

            // Handle string method names
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

        // ============================================
        // USER & PROFILE GENERATORS
        // ============================================
        ...userGenerators,

        // ============================================
        // E-COMMERCE GENERATORS
        // ============================================
        ...ecommerceGenerators,

        // ============================================
        // SOCIAL & COMMUNICATION GENERATORS
        // ============================================
        ...socialGenerators,

        // ============================================
        // BUSINESS & ENTERPRISE GENERATORS
        // ============================================
        ...businessGenerators,

        // ============================================
        // FINANCE GENERATORS
        // ============================================
        ...financeGenerators,

        // ============================================
        // CONTENT & MEDIA GENERATORS
        // ============================================
        ...contentGenerators,

        // ============================================
        // TRAVEL & AUTOMOTIVE GENERATORS
        // ============================================
        ...travelGenerators,

        // ============================================
        // REAL ESTATE GENERATORS
        // ============================================
        ...realEstateGenerators,

        // ============================================
        // FOOD & RESTAURANT GENERATORS
        // ============================================
        ...foodGenerators,

        // ============================================
        // TECHNICAL & API GENERATORS
        // ============================================
        ...technicalGenerators,

        // ============================================
        // HEALTHCARE & EDUCATION GENERATORS
        // ============================================
        ...healthcareGenerators
    };

    return generator;
}

module.exports = dataGenerator;
