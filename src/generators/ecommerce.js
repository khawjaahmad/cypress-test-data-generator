const { initFaker } = require('../utils/faker-utils');
const { validatePositiveInteger } = require('../utils/validators');

/**
 * Create e-commerce generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} E-commerce generator methods
 */
const createEcommerceGenerators = (applyPlugins) => {
    const generators = {
        /**
         * Generate product data
         * @param {Object} options - Generation options
         * @returns {Object} Generated product data
         */
        generateProduct(options = {}) {
            const { seed, locale, customFields = {}, relatedProducts = [] } = options;
            const f = initFaker({ seed, locale });

            const product = {
                id: f.string.uuid(),
                name: f.commerce.productName(),
                description: f.lorem.paragraph(),
                price: parseFloat(f.commerce.price()),
                category: f.commerce.department(),
                inStock: f.datatype.boolean(),
                image: f.image.url(),
                sku: f.string.alphanumeric(8).toUpperCase(),
                relatedProducts,
                ...customFields
            };

            return applyPlugins(product);
        },

        /**
         * Generate order data with products
         * @param {Object} options - Generation options
         * @returns {Object} Generated order data
         */
        generateOrder(options = {}) {
            const { seed, locale, productCount = 3 } = options;
            const f = initFaker({ seed, locale });

            if (productCount <= 0) {
                throw new Error('Product count must be a positive number');
            }

            const products = Array.from({ length: productCount }, (_, i) => {
                const productOptions = seed ? { seed: seed + i + 1, locale } : { locale };
                return generators.generateProduct(productOptions);
            });

            const order = {
                id: f.string.uuid(),
                customerName: f.person.fullName(),
                orderDate: f.date.recent(),
                products: products,
                totalAmount: parseFloat(products.reduce((sum, product) => sum + product.price, 0).toFixed(2)),
                shippingAddress: {
                    street: f.location.streetAddress(),
                    city: f.location.city(),
                    state: f.location.state(),
                    zipCode: f.location.zipCode(),
                    country: f.location.country()
                }
            };

            return applyPlugins(order);
        },

        /**
         * Generate review data
         * @param {Object} options - Generation options
         * @returns {Object} Generated review data
         */
        generateReview(options = {}) {
            const { seed, locale, productId } = options;
            const f = initFaker({ seed, locale });

            const review = {
                id: f.number.int({ min: 10000, max: 99999 }).toString(),
                productId: productId || f.number.int({ min: 10000, max: 99999 }).toString(),
                rating: f.number.int({ min: 1, max: 5 }),
                comment: f.lorem.paragraph(),
                reviewerName: f.person.fullName(),
                reviewDate: f.date.recent({ days: 30 }).toISOString().split('T')[0],
                helpful: f.number.int({ min: 0, max: 100 }),
                verified: f.datatype.boolean()
            };

            return applyPlugins(review);
        },

        /**
         * Generate category data
         * @param {Object} options - Generation options
         * @returns {Object} Generated category data
         */
        generateCategory(options = {}) {
            const { seed, locale, parentId = null } = options;
            const f = initFaker({ seed, locale });

            const name = f.commerce.department();

            return applyPlugins({
                id: f.string.uuid(),
                name,
                description: f.commerce.productDescription(),
                parentId,
                slug: f.helpers.slugify(name.toLowerCase()),
                isActive: f.datatype.boolean()
            });
        },

        /**
         * Generate inventory data
         * @param {string} productId - Product ID to associate with
         * @param {Object} options - Generation options
         * @returns {Object} Generated inventory data
         */
        generateInventory(productId, options = {}) {
            const { seed, locale } = options;
            const f = initFaker({ seed, locale });

            return applyPlugins({
                productId: productId || f.string.uuid(),
                quantity: f.number.int({ min: 0, max: 1000 }),
                lastUpdated: f.date.recent(),
                warehouseLocation: f.location.city(),
                reorderPoint: f.number.int({ min: 10, max: 100 })
            });
        },

        /**
         * Generate coupon data
         * @param {Object} options - Generation options
         * @returns {Object} Generated coupon data
         */
        generateCoupon(options = {}) {
            const { seed, locale } = options;
            const f = initFaker({ seed, locale });

            return applyPlugins({
                code: f.string.alphanumeric(8).toUpperCase(),
                discountType: f.helpers.arrayElement(['percentage', 'fixed']),
                discountValue: f.number.int({ min: 5, max: 50 }),
                expirationDate: f.date.future(),
                minPurchaseAmount: f.number.int({ min: 0, max: 100 }),
                isActive: f.datatype.boolean()
            });
        },

        /**
         * Generate shipping method data
         * @param {Object} options - Generation options
         * @returns {Object} Generated shipping method data
         */
        generateShippingMethod(options = {}) {
            const { seed, locale } = options;
            const f = initFaker({ seed, locale });

            return applyPlugins({
                id: f.string.uuid(),
                name: f.helpers.arrayElement(['Standard', 'Express', 'Overnight', 'Economy', 'Priority']),
                price: parseFloat(f.commerce.price({ min: 5, max: 50 })),
                estimatedDeliveryDays: f.number.int({ min: 1, max: 10 }),
                provider: f.company.name(),
                isAvailable: f.datatype.boolean()
            });
        },

        /**
         * Generate payment method data
         * @param {Object} options - Generation options
         * @returns {Object} Generated payment method data
         */
        generatePaymentMethod(options = {}) {
            const { seed, locale } = options;
            const f = initFaker({ seed, locale });

            return applyPlugins({
                id: f.string.uuid(),
                type: f.helpers.arrayElement(['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery', 'Apple Pay', 'Google Pay']),
                name: f.finance.accountName(),
                isDefault: f.datatype.boolean(),
                lastFour: f.finance.creditCardNumber('####'),
                expiryDate: f.date.future()
            });
        },

        /**
         * Generate related products for a main product
         * @param {string} mainProductId - Main product ID
         * @param {number} count - Number of related products
         * @param {Object} options - Generation options
         * @returns {Array} Array of related products
         */
        generateRelatedProducts(mainProductId, count = 3, options = {}) {
            const { seed, locale } = options;

            validatePositiveInteger(count, 'count');

            const relatedProducts = Array.from({ length: count }, (_, i) => {
                const productOptions = seed ? { seed: seed + i, locale } : { locale };
                return generators.generateProduct(productOptions);
            });

            return relatedProducts.map(product => ({
                ...product,
                relatedToProductId: mainProductId
            }));
        },

        /**
         * Generate a product with its related products
         * @param {Object} options - Generation options
         * @returns {Object} Product with related products
         */
        generateProductWithRelations(options = {}) {
            const { seed, locale, relatedProductCount = 3 } = options;

            const mainProduct = generators.generateProduct({ seed, locale });
            const relatedProducts = generators.generateRelatedProducts(
                mainProduct.id,
                relatedProductCount,
                { seed: seed ? seed + 100 : undefined, locale }
            );

            return {
                ...mainProduct,
                relatedProducts
            };
        },

        /**
         * Generate shopping cart data
         * @param {Object} options - Generation options
         * @returns {Object} Generated cart data
         */
        generateCart(options = {}) {
            const { seed, locale, itemCount = 3 } = options || {};
            const f = initFaker({ seed, locale });

            const items = Array.from({ length: Math.max(1, itemCount) }, () => {
                const price = parseFloat(f.commerce.price());
                const quantity = f.number.int({ min: 1, max: 10 });
                return {
                    id: f.string.uuid(),
                    productId: f.string.uuid(),
                    productName: f.commerce.productName(),
                    productImage: f.image.url(),
                    price,
                    quantity,
                    subtotal: parseFloat((price * quantity).toFixed(2)),
                    variant: f.helpers.maybe(() => ({
                        size: f.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL']),
                        color: f.color.human()
                    })) || null
                };
            });

            const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
            const taxRate = 0.08;
            const tax = parseFloat((subtotal * taxRate).toFixed(2));

            return applyPlugins({
                id: f.string.uuid(),
                userId: f.string.uuid(),
                items,
                itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
                subtotal: parseFloat(subtotal.toFixed(2)),
                tax,
                discount: parseFloat(f.commerce.price({ min: 0, max: 20 })),
                total: parseFloat((subtotal + tax).toFixed(2)),
                couponCode: f.helpers.maybe(() => f.string.alphanumeric(8).toUpperCase()) || null,
                createdAt: f.date.recent({ days: 7 }).toISOString(),
                updatedAt: f.date.recent({ days: 1 }).toISOString(),
                expiresAt: f.date.future({ years: 0.1 }).toISOString()
            });
        },

        /**
         * Generate wishlist data
         * @param {Object} options - Generation options
         * @returns {Object} Generated wishlist data
         */
        generateWishlist(options = {}) {
            const { seed, locale, itemCount = 5 } = options || {};
            const f = initFaker({ seed, locale });

            const items = Array.from({ length: Math.max(1, itemCount) }, () => ({
                id: f.string.uuid(),
                productId: f.string.uuid(),
                productName: f.commerce.productName(),
                productImage: f.image.url(),
                price: parseFloat(f.commerce.price()),
                originalPrice: parseFloat(f.commerce.price({ min: 100, max: 500 })),
                inStock: f.datatype.boolean(),
                addedAt: f.date.recent({ days: 30 }).toISOString(),
                priority: f.helpers.arrayElement(['low', 'medium', 'high']),
                notes: f.helpers.maybe(() => f.lorem.sentence()) || null
            }));

            return applyPlugins({
                id: f.string.uuid(),
                userId: f.string.uuid(),
                name: f.helpers.arrayElement(['My Wishlist', 'Birthday Ideas', 'Holiday List', 'Favorites']),
                isPublic: f.datatype.boolean(),
                items,
                totalItems: items.length,
                totalValue: parseFloat(items.reduce((sum, item) => sum + item.price, 0).toFixed(2)),
                createdAt: f.date.past({ years: 1 }).toISOString(),
                updatedAt: f.date.recent({ days: 7 }).toISOString()
            });
        },

        /**
         * Generate return/refund request data
         * @param {Object} options - Generation options
         * @returns {Object} Generated return data
         */
        generateReturn(options = {}) {
            const { seed, locale, orderId = null } = options || {};
            const f = initFaker({ seed, locale });

            const reasons = [
                'Defective product',
                'Wrong item received',
                'Item not as described',
                'Changed mind',
                'Better price found',
                'Arrived too late',
                'Damaged in shipping',
                'Size/fit issue'
            ];

            return applyPlugins({
                id: f.string.uuid(),
                orderId: orderId || f.string.uuid(),
                customerId: f.string.uuid(),
                status: f.helpers.arrayElement(['pending', 'approved', 'rejected', 'processing', 'completed', 'cancelled']),
                reason: f.helpers.arrayElement(reasons),
                description: f.lorem.paragraph(),
                items: Array.from({ length: f.number.int({ min: 1, max: 3 }) }, () => ({
                    productId: f.string.uuid(),
                    productName: f.commerce.productName(),
                    quantity: f.number.int({ min: 1, max: 5 }),
                    price: parseFloat(f.commerce.price())
                })),
                refundAmount: parseFloat(f.commerce.price({ min: 10, max: 500 })),
                refundMethod: f.helpers.arrayElement(['original_payment', 'store_credit', 'bank_transfer']),
                returnShippingLabel: f.helpers.maybe(() => f.internet.url()) || null,
                trackingNumber: f.helpers.maybe(() => f.string.alphanumeric(12).toUpperCase()) || null,
                photos: Array.from({ length: f.number.int({ min: 0, max: 3 }) }, () => f.image.url()),
                requestedAt: f.date.recent({ days: 14 }).toISOString(),
                processedAt: f.helpers.maybe(() => f.date.recent({ days: 7 }).toISOString()) || null,
                completedAt: f.helpers.maybe(() => f.date.recent({ days: 3 }).toISOString()) || null
            });
        }
    };

    return generators;
};

module.exports = createEcommerceGenerators;
