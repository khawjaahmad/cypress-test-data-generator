const { initFaker } = require('../utils/faker-utils');

/**
 * Create food/restaurant generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} Food generator methods
 */
const createFoodGenerators = (applyPlugins) => ({
    /**
     * Generate restaurant data
     * @param {Object} options - Generation options
     * @returns {Object} Generated restaurant data
     */
    generateRestaurant(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        const cuisineTypes = ['Italian', 'Chinese', 'Japanese', 'Mexican', 'Indian', 'Thai', 'French', 'American', 'Mediterranean', 'Korean'];
        const priceRanges = ['$', '$$', '$$$', '$$$$'];

        return applyPlugins({
            id: f.string.uuid(),
            name: f.company.name() + ' ' + f.helpers.arrayElement(['Restaurant', 'Bistro', 'Cafe', 'Kitchen', 'Grill', 'Eatery']),
            description: f.lorem.paragraph(),
            cuisine: Array.from({ length: f.number.int({ min: 1, max: 3 }) }, () => f.helpers.arrayElement(cuisineTypes)),
            priceRange: f.helpers.arrayElement(priceRanges),
            rating: f.number.float({ min: 1, max: 5, multipleOf: 0.1 }),
            reviewCount: f.number.int({ min: 0, max: 5000 }),
            address: {
                street: f.location.streetAddress(),
                city: f.location.city(),
                state: f.location.state(),
                zipCode: f.location.zipCode(),
                country: f.location.country()
            },
            coordinates: {
                latitude: f.location.latitude(),
                longitude: f.location.longitude()
            },
            phone: f.phone.number(),
            email: f.internet.email(),
            website: f.internet.url(),
            hours: {
                monday: { open: '11:00', close: '22:00' },
                tuesday: { open: '11:00', close: '22:00' },
                wednesday: { open: '11:00', close: '22:00' },
                thursday: { open: '11:00', close: '22:00' },
                friday: { open: '11:00', close: '23:00' },
                saturday: { open: '10:00', close: '23:00' },
                sunday: { open: '10:00', close: '21:00' }
            },
            features: Array.from({ length: f.number.int({ min: 2, max: 8 }) }, () =>
                f.helpers.arrayElement([
                    'Outdoor Seating', 'Takeout', 'Delivery', 'Reservations',
                    'Wifi', 'Parking', 'Wheelchair Accessible', 'Live Music',
                    'Happy Hour', 'Private Dining', 'Bar', 'Kids Menu'
                ])
            ),
            images: Array.from({ length: f.number.int({ min: 3, max: 10 }) }, () => f.image.url()),
            isOpen: f.datatype.boolean(),
            acceptsReservations: f.datatype.boolean(),
            deliveryPartners: Array.from({ length: f.number.int({ min: 0, max: 3 }) }, () =>
                f.helpers.arrayElement(['Uber Eats', 'DoorDash', 'Grubhub', 'Postmates'])
            ),
            averageWaitTime: f.number.int({ min: 5, max: 60 }),
            establishedYear: f.date.past({ years: 50 }).getFullYear()
        });
    },

    /**
     * Generate menu item data
     * @param {Object} options - Generation options
     * @returns {Object} Generated menu item data
     */
    generateMenuItem(options = {}) {
        const { seed, locale, restaurantId = null } = options || {};
        const f = initFaker({ seed, locale });

        const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Soups', 'Salads', 'Sides', 'Specials'];
        const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'keto', 'halal', 'kosher'];

        return applyPlugins({
            id: f.string.uuid(),
            restaurantId: restaurantId || f.string.uuid(),
            name: f.commerce.productName(),
            description: f.lorem.sentence({ min: 10, max: 20 }),
            category: f.helpers.arrayElement(categories),
            price: parseFloat(f.commerce.price({ min: 5, max: 50 })),
            currency: f.finance.currencyCode(),
            image: f.image.url(),
            ingredients: Array.from({ length: f.number.int({ min: 3, max: 10 }) }, () => f.commerce.productMaterial()),
            allergens: Array.from({ length: f.number.int({ min: 0, max: 4 }) }, () =>
                f.helpers.arrayElement(['Nuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Fish', 'Shellfish'])
            ),
            dietaryInfo: Array.from({ length: f.number.int({ min: 0, max: 3 }) }, () => f.helpers.arrayElement(dietaryOptions)),
            calories: f.number.int({ min: 100, max: 2000 }),
            preparationTime: f.number.int({ min: 5, max: 45 }),
            spicyLevel: f.number.int({ min: 0, max: 5 }),
            isAvailable: f.datatype.boolean(),
            isPopular: f.datatype.boolean(),
            isNewItem: f.datatype.boolean(),
            rating: f.number.float({ min: 1, max: 5, multipleOf: 0.1 }),
            reviewCount: f.number.int({ min: 0, max: 500 }),
            customizations: Array.from({ length: f.number.int({ min: 0, max: 3 }) }, () => ({
                name: f.helpers.arrayElement(['Size', 'Spice Level', 'Add-ons', 'Sauce']),
                options: Array.from({ length: f.number.int({ min: 2, max: 4 }) }, () => ({
                    name: f.lorem.word(),
                    priceModifier: parseFloat(f.commerce.price({ min: 0, max: 5 }))
                }))
            })),
            nutritionInfo: {
                protein: f.number.int({ min: 0, max: 50 }),
                carbs: f.number.int({ min: 0, max: 100 }),
                fat: f.number.int({ min: 0, max: 50 }),
                fiber: f.number.int({ min: 0, max: 20 }),
                sodium: f.number.int({ min: 0, max: 2000 })
            }
        });
    },

    /**
     * Generate food order data
     * @param {Object} options - Generation options
     * @returns {Object} Generated food order data
     */
    generateFoodOrder(options = {}) {
        const { seed, locale, itemCount = 3 } = options || {};
        const f = initFaker({ seed, locale });

        const items = Array.from({ length: Math.max(1, itemCount) }, () => {
            const price = parseFloat(f.commerce.price({ min: 5, max: 30 }));
            const quantity = f.number.int({ min: 1, max: 5 });
            return {
                id: f.string.uuid(),
                name: f.commerce.productName(),
                price,
                quantity,
                subtotal: parseFloat((price * quantity).toFixed(2)),
                specialInstructions: f.helpers.maybe(() => f.lorem.sentence()) || null,
                customizations: f.helpers.maybe(() => [f.lorem.word()]) || []
            };
        });

        const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
        const deliveryFee = parseFloat(f.commerce.price({ min: 0, max: 10 }));
        const tip = parseFloat((subtotal * f.number.float({ min: 0.1, max: 0.25, multipleOf: 0.01 })).toFixed(2));
        const tax = parseFloat((subtotal * 0.08).toFixed(2));

        return applyPlugins({
            id: f.string.uuid(),
            orderNumber: `ORD-${f.string.numeric(8)}`,
            status: f.helpers.arrayElement(['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled']),
            type: f.helpers.arrayElement(['delivery', 'pickup', 'dine_in']),
            restaurant: {
                id: f.string.uuid(),
                name: f.company.name() + ' Restaurant',
                address: f.location.streetAddress(),
                phone: f.phone.number()
            },
            customer: {
                id: f.string.uuid(),
                name: f.person.fullName(),
                phone: f.phone.number(),
                email: f.internet.email()
            },
            deliveryAddress: {
                street: f.location.streetAddress(),
                city: f.location.city(),
                state: f.location.state(),
                zipCode: f.location.zipCode(),
                instructions: f.helpers.maybe(() => f.lorem.sentence()) || null
            },
            items,
            subtotal: parseFloat(subtotal.toFixed(2)),
            deliveryFee,
            tax,
            tip,
            total: parseFloat((subtotal + deliveryFee + tax + tip).toFixed(2)),
            paymentMethod: f.helpers.arrayElement(['credit_card', 'debit_card', 'cash', 'apple_pay', 'google_pay']),
            isPaid: f.datatype.boolean(),
            estimatedDeliveryTime: f.date.soon({ days: 0.05 }).toISOString(),
            actualDeliveryTime: f.helpers.maybe(() => f.date.recent({ days: 0.05 }).toISOString()) || null,
            driver: f.helpers.maybe(() => ({
                id: f.string.uuid(),
                name: f.person.fullName(),
                phone: f.phone.number(),
                vehicle: f.vehicle.model(),
                rating: f.number.float({ min: 3, max: 5, multipleOf: 0.1 })
            })) || null,
            rating: f.helpers.maybe(() => f.number.int({ min: 1, max: 5 })) || null,
            review: f.helpers.maybe(() => f.lorem.sentence()) || null,
            createdAt: f.date.recent({ days: 7 }).toISOString(),
            updatedAt: f.date.recent({ days: 1 }).toISOString()
        });
    }
});

module.exports = createFoodGenerators;
