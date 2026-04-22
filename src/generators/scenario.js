const { initFaker } = require('../utils/faker-utils');
const { validatePositiveInteger } = require('../utils/validators');

/**
 * Relational scenario generator. Produces linked users/products/orders/reviews
 * with real foreign keys so consumers don't have to manually wire IDs across
 * generator calls.
 *
 * @param {Function} applyPlugins
 * @param {Object} generators - Other generators used for composition.
 */
const createScenarioGenerator = (applyPlugins, generators) => ({
    /**
     * @param {Object} [options]
     * @param {number} [options.users=3]
     * @param {number} [options.ordersPerUser=0]
     * @param {number} [options.productsPerOrder=3]
     * @param {number} [options.productsCount] - Shared catalog size. Defaults
     *   to at least `users * ordersPerUser * productsPerOrder`.
     * @param {number} [options.reviewsPerProduct=0]
     * @param {number|string} [options.seed]
     * @param {string} [options.locale]
     */
    generateScenario(options = {}) {
        const {
            users: userCount = 3,
            ordersPerUser = 0,
            productsPerOrder = 3,
            reviewsPerProduct = 0,
            seed,
            locale,
        } = options;

        validatePositiveInteger(userCount, 'users');
        if (ordersPerUser < 0) throw new Error('ordersPerUser must be >= 0');
        if (productsPerOrder < 1) throw new Error('productsPerOrder must be >= 1');
        if (reviewsPerProduct < 0) throw new Error('reviewsPerProduct must be >= 0');

        const numericSeed =
            seed !== undefined && seed !== null
                ? typeof seed === 'string'
                    ? parseInt(seed, 10)
                    : seed
                : undefined;
        const seedOf = (offset) =>
            numericSeed !== undefined ? numericSeed + offset : undefined;

        const users = Array.from({ length: userCount }, (_, i) =>
            generators.generateUser({ seed: seedOf(i), locale, strict: true })
        );

        const productsCount = Math.max(
            options.productsCount ?? userCount * Math.max(ordersPerUser, 1) * productsPerOrder,
            productsPerOrder
        );
        const products = Array.from({ length: productsCount }, (_, i) =>
            generators.generateProduct({ seed: seedOf(10_000 + i), locale })
        );

        const orders = [];
        for (let u = 0; u < users.length; u++) {
            const user = users[u];
            for (let o = 0; o < ordersPerUser; o++) {
                const orderSeed = seedOf(100_000 + u * ordersPerUser + o);
                const f = initFaker({ seed: orderSeed, locale });
                const picked = sampleWithoutReplacement(f, products, productsPerOrder);
                orders.push(
                    applyPlugins({
                        id: f.string.uuid(),
                        userId: user.id,
                        customerName: `${user.firstName} ${user.lastName}`,
                        orderDate: f.date.recent({ days: 30 }),
                        products: picked,
                        totalAmount: parseFloat(
                            picked.reduce((sum, p) => sum + p.price, 0).toFixed(2)
                        ),
                        shippingAddress: user.address,
                    })
                );
            }
        }

        const reviews = [];
        for (let p = 0; p < products.length; p++) {
            const product = products[p];
            for (let r = 0; r < reviewsPerProduct; r++) {
                const reviewSeed = seedOf(1_000_000 + p * reviewsPerProduct + r);
                const f = initFaker({ seed: reviewSeed, locale });
                const reviewer = users[f.number.int({ min: 0, max: users.length - 1 })];
                reviews.push(
                    applyPlugins({
                        id: f.string.uuid(),
                        productId: product.id,
                        userId: reviewer.id,
                        reviewerName: `${reviewer.firstName} ${reviewer.lastName}`,
                        rating: f.number.int({ min: 1, max: 5 }),
                        comment: f.lorem.paragraph(),
                        reviewDate: f.date.recent({ days: 90 }).toISOString().split('T')[0],
                        helpful: f.number.int({ min: 0, max: 100 }),
                        verified: f.datatype.boolean(),
                    })
                );
            }
        }

        return applyPlugins({ users, products, orders, reviews });
    },
});

// Fisher-Yates partial shuffle. Used instead of faker.helpers.arrayElements
// because the latter doesn't guarantee stable sampling across calls with the
// same seed.
function sampleWithoutReplacement(f, pool, k) {
    const n = pool.length;
    if (k >= n) return pool.slice();
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < k; i++) {
        const j = i + f.number.int({ min: 0, max: n - 1 - i });
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, k).map((i) => pool[i]);
}

module.exports = createScenarioGenerator;
