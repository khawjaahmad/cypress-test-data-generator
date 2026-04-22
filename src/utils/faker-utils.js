const {
    Faker,
    faker,
    fakerDE,
    fakerFR,
    fakerES,
    fakerIT,
    fakerPT_BR,
    fakerJA,
    fakerZH_CN,
    fakerKO,
    fakerRU,
    base,
    en,
    de,
    fr,
    es,
    it,
    pt_BR,
    ja,
    zh_CN,
    ko,
    ru,
} = require('@faker-js/faker');

// Kept for backwards compatibility. Prefer `initFaker()` — these shared
// instances mutate their seed state when reseeded and are unsafe for
// concurrent generation.
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

// Locale chains mirror the layering of the prebuilt faker singletons, so a
// fresh Faker constructed from a chain produces the same data a consumer
// would see from `fakerDE` etc.
const localeChains = {
    en: [en, base],
    de: [de, en, base],
    fr: [fr, en, base],
    es: [es, en, base],
    it: [it, en, base],
    pt_BR: [pt_BR, en, base],
    ja: [ja, en, base],
    zh_CN: [zh_CN, en, base],
    ko: [ko, en, base],
    ru: [ru, en, base],
};

const resolveLocaleChain = (locale) => {
    if (!locale) return localeChains.en;
    if (localeChains[locale]) return localeChains[locale];
    const baseLocale = locale.split('_')[0];
    if (localeChains[baseLocale]) return localeChains[baseLocale];
    return localeChains.en;
};

/**
 * Return a prebuilt shared Faker instance. Retained for backwards
 * compatibility; callers should use `initFaker()` instead — seeding this
 * instance mutates state other calls can observe.
 */
const getFakerForLocale = (locale) => {
    if (!locale) return faker;
    if (fakerInstances[locale]) return fakerInstances[locale];
    const baseLocale = locale.split('_')[0];
    if (fakerInstances[baseLocale]) return fakerInstances[baseLocale];
    return faker;
};

/**
 * Create an isolated Faker instance for a single generation call. Each
 * call returns a fresh Faker so seeding cannot leak across calls.
 *
 * @param {Object} [options]
 * @param {number|string} [options.seed]
 * @param {string} [options.locale] - e.g. 'en', 'de', 'de_AT'
 */
const initFaker = (options = {}) => {
    const { seed, locale } = options;
    const fakerOptions = { locale: resolveLocaleChain(locale) };

    if (seed !== undefined && seed !== null) {
        const numericSeed = typeof seed === 'string' ? parseInt(seed, 10) : seed;
        if (!isNaN(numericSeed)) {
            fakerOptions.seed = numericSeed;
        }
    }

    return new Faker(fakerOptions);
};

const createPluginSystem = () => {
    const plugins = [];

    return {
        registerPlugin: (plugin) => {
            if (typeof plugin !== 'function') {
                throw new Error('Plugin must be a function');
            }
            plugins.push(plugin);
        },

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

        getPluginCount: () => plugins.length,
    };
};

module.exports = {
    faker,
    fakerInstances,
    getFakerForLocale,
    initFaker,
    createPluginSystem,
};
