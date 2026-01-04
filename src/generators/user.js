const { initFaker } = require('../utils/faker-utils');
const { validateAgeRange, isValidEmail } = require('../utils/validators');

/**
 * Create user generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} User generator methods
 */
const createUserGenerators = (applyPlugins) => ({
    /**
     * Generate user data
     * @param {Object} options - Generation options
     * @returns {Object} Generated user data
     */
    generateUser(options = {}) {
        try {
            const {
                seed,
                locale,
                ageRange = { min: 18, max: 99 },
                country = null,
                ageMin = 18,
                ageMax = 99
            } = options;

            const f = initFaker({ seed, locale });

            const effectiveMin = Math.max(ageMin, ageRange.min);
            const effectiveMax = Math.min(ageMax, ageRange.max);

            validateAgeRange(effectiveMin, effectiveMax);

            const user = {
                id: f.string.uuid(),
                firstName: f.person.firstName(),
                lastName: f.person.lastName(),
                email: f.internet.email(),
                age: f.number.int({ min: effectiveMin, max: effectiveMax }),
                address: {
                    street: f.location.streetAddress(),
                    city: f.location.city(),
                    state: f.location.state(),
                    zipCode: f.location.zipCode(),
                    country: country || f.location.country()
                }
            };

            if (!isValidEmail(user.email)) {
                throw new Error('Invalid email format generated');
            }

            return applyPlugins(user);
        } catch (error) {
            return { error: error.message };
        }
    },

    /**
     * Generate address data
     * @param {Object} options - Generation options
     * @returns {Object} Generated address data
     */
    generateAddress(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        return applyPlugins({
            id: f.string.uuid(),
            street: f.location.streetAddress(),
            city: f.location.city(),
            state: f.location.state(),
            zipCode: f.location.zipCode(),
            country: f.location.country(),
            latitude: f.location.latitude(),
            longitude: f.location.longitude(),
            isDefault: f.datatype.boolean()
        });
    }
});

module.exports = createUserGenerators;
