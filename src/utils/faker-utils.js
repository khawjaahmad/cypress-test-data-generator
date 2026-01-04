const { faker, fakerDE, fakerFR, fakerES, fakerIT, fakerPT_BR, fakerJA, fakerZH_CN, fakerKO, fakerRU } = require('@faker-js/faker');

/**
 * Locale to faker instance mapping
 */
const fakerInstances = {
    en: faker,
    de: fakerDE,
    fr: fakerFR,
    es: fakerES,
    it: fakerIT,
    pt_BR: fakerPT_BR,
    ja: fakerJA,
    zh_CN: fakerZH_CN,
    ko: fakerKO,
    ru: fakerRU,
};

/**
 * Get the faker instance for a given locale
 * @param {string} locale - Locale code
 * @returns {Object} Faker instance
 */
const getFakerForLocale = (locale) => {
    if (!locale) return faker;

    // Try exact match first
    if (fakerInstances[locale]) {
        return fakerInstances[locale];
    }

    // Try base locale (e.g., 'de_AT' -> 'de')
    const baseLocale = locale.split('_')[0];
    if (fakerInstances[baseLocale]) {
        return fakerInstances[baseLocale];
    }

    // Fallback to default
    return faker;
};

/**
 * Initialize faker with options (seed and locale)
 * @param {Object} options - Options object with seed and locale
 * @returns {Object} Faker instance to use
 */
const initFaker = (options = {}) => {
    const { seed, locale } = options;
    const fakerInstance = getFakerForLocale(locale);

    if (seed !== undefined && seed !== null) {
        const numericSeed = typeof seed === 'string' ? parseInt(seed, 10) : seed;
        if (!isNaN(numericSeed)) {
            fakerInstance.seed(numericSeed);
        }
    }

    return fakerInstance;
};

/**
 * Create a plugin system for data transformation
 * @returns {Object} Plugin system methods
 */
const createPluginSystem = () => {
    const plugins = [];

    return {
        /**
         * Register a plugin to transform generated data
         * @param {Function} plugin - Transform function
         */
        registerPlugin: (plugin) => {
            if (typeof plugin !== 'function') {
                throw new Error('Plugin must be a function');
            }
            plugins.push(plugin);
        },

        /**
         * Apply all registered plugins to data
         * @param {Object} data - Generated data
         * @returns {Object} Transformed data
         */
        applyPlugins: (data) => {
            return plugins.reduce((acc, plugin) => {
                try {
                    return plugin(acc);
                } catch (error) {
                    console.warn(`Plugin execution failed: ${error.message}`);
                    return acc;
                }
            }, data);
        },

        /**
         * Get registered plugins count
         * @returns {number} Number of plugins
         */
        getPluginCount: () => plugins.length
    };
};

module.exports = {
    faker,
    fakerInstances,
    getFakerForLocale,
    initFaker,
    createPluginSystem
};
