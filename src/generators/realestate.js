const { initFaker } = require('../utils/faker-utils');

/**
 * Create real estate generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} Real estate generator methods
 */
const createRealEstateGenerators = (applyPlugins) => ({
    /**
     * Generate property listing data
     * @param {Object} options - Generation options
     * @returns {Object} Generated property data
     */
    generateProperty(options = {}) {
        const { seed, locale, type = null } = options || {};
        const f = initFaker({ seed, locale });

        const propertyTypes = ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial', 'industrial'];
        const yearBuilt = f.date.past({ years: 100 }).getFullYear();

        return applyPlugins({
            id: f.string.uuid(),
            listingId: `MLS-${f.string.numeric(8)}`,
            type: type || f.helpers.arrayElement(propertyTypes),
            status: f.helpers.arrayElement(['for_sale', 'for_rent', 'sold', 'pending', 'off_market']),
            title: f.lorem.sentence({ min: 4, max: 8 }),
            description: f.lorem.paragraphs(3),
            address: {
                street: f.location.streetAddress(),
                city: f.location.city(),
                state: f.location.state(),
                zipCode: f.location.zipCode(),
                country: f.location.country(),
                coordinates: {
                    latitude: f.location.latitude(),
                    longitude: f.location.longitude()
                }
            },
            price: f.number.int({ min: 50000, max: 10000000 }),
            currency: f.finance.currencyCode(),
            pricePerSqFt: f.number.int({ min: 50, max: 1000 }),
            bedrooms: f.number.int({ min: 0, max: 10 }),
            bathrooms: f.number.float({ min: 1, max: 8, multipleOf: 0.5 }),
            squareFeet: f.number.int({ min: 500, max: 10000 }),
            lotSize: f.number.float({ min: 0.1, max: 10, multipleOf: 0.01 }),
            yearBuilt,
            features: Array.from({ length: f.number.int({ min: 3, max: 10 }) }, () =>
                f.helpers.arrayElement([
                    'Swimming Pool', 'Garage', 'Garden', 'Fireplace', 'Central AC',
                    'Hardwood Floors', 'Granite Counters', 'Stainless Appliances',
                    'Walk-in Closet', 'Smart Home', 'Solar Panels', 'Security System'
                ])
            ),
            images: Array.from({ length: f.number.int({ min: 3, max: 15 }) }, () => f.image.url()),
            virtualTourUrl: f.helpers.maybe(() => f.internet.url()) || null,
            agent: {
                id: f.string.uuid(),
                name: f.person.fullName(),
                phone: f.phone.number(),
                email: f.internet.email(),
                company: f.company.name() + ' Realty',
                photo: f.image.avatar()
            },
            openHouses: Array.from({ length: f.number.int({ min: 0, max: 3 }) }, () => ({
                date: f.date.future({ years: 0.1 }).toISOString().split('T')[0],
                startTime: f.helpers.arrayElement(['10:00', '11:00', '12:00', '13:00', '14:00']),
                endTime: f.helpers.arrayElement(['15:00', '16:00', '17:00', '18:00'])
            })),
            listedDate: f.date.recent({ days: 90 }).toISOString().split('T')[0],
            daysOnMarket: f.number.int({ min: 1, max: 180 }),
            views: f.number.int({ min: 0, max: 10000 }),
            saves: f.number.int({ min: 0, max: 500 })
        });
    }
});

module.exports = createRealEstateGenerators;
