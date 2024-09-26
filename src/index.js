const { faker } = require('@faker-js/faker');

function dataGenerator(on, config) {
    let currentSeed = Date.now();
    const plugins = [];

    const registerPlugin = (plugin) => {
        plugins.push(plugin);
    };

    const applyPlugins = (data) => {
        return plugins.reduce((acc, plugin) => {
            return typeof plugin === 'function' ? plugin(acc) : acc;
        }, data);
    };

    const setSeed = (seed) => {
        currentSeed = seed;
        faker.seed(currentSeed);
    };

    const setLocale = (locale) => {
        try {
            faker.locale = locale;
        } catch (error) {
            console.warn(`Failed to set locale '${locale}'. Falling back to default locale. Error: ${error.message}`);
        }
    };

    const generateBulk = (generateFunc, count, options = {}) => {
        return Array.from({ length: count }, () => generateFunc(options));
    };

    const validateUser = (user, ageRange) => {
        if (!user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            throw new Error('Invalid email format');
        }
        if (typeof user.firstName !== 'string' || typeof user.lastName !== 'string') {
            throw new Error('First name and last name must be strings');
        }
        if (typeof user.age !== 'number' || user.age < ageRange.min || user.age > ageRange.max) {
            throw new Error(`Age must be a number between ${ageRange.min} and ${ageRange.max}`);
        }
    };

    const generator = {
        registerPlugin,
        setSeed,
        setLocale,
        generateBulk,

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

                if (seed) faker.seed(seed);
                if (locale) setLocale(locale);

                if (ageMin > ageMax) {
                    throw new Error(`Max ${ageMax} should be greater than min ${ageMin}.`);
                }

                const user = {
                    id: faker.string.uuid(), // Add a unique ID
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    age: faker.number.int({ min: Math.max(ageMin, ageRange.min), max: Math.min(ageMax, ageRange.max) }),
                    address: {
                        street: faker.location.streetAddress(),
                        city: faker.location.city(),
                        state: faker.location.state(),
                        zipCode: faker.location.zipCode(),
                        country: country || faker.location.country()
                    }
                };

                validateUser(user, ageRange);
                return applyPlugins(user);
            } catch (error) {
                return { error: error.message };
            }
        },

        generateProduct(options = {}) {
            const { seed, locale, customFields = {}, relatedProducts = [] } = options;
            if (seed) setSeed(seed);
            if (locale) {
                setLocale(locale);
                console.log(`Locale set to: ${faker.locale}`);
            }

            let description = faker.lorem.paragraph();
            if (locale === 'de') {
                const germanChars = 'äöüßÄÖÜ';
                const randomChar = germanChars[Math.floor(Math.random() * germanChars.length)];
                description = description.replace(/[a-z]/i, randomChar);
            }

            const product = {
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                description: description,
                price: parseFloat(faker.commerce.price()),
                category: faker.commerce.department(),
                inStock: faker.datatype.boolean(),
                image: faker.image.url(),
                sku: faker.string.alphanumeric(8).toUpperCase(),
                relatedProducts,
                ...customFields  // Spread custom fields at the end to ensure they override any default fields
            };

            console.log('Generated product:', product);  // Add this line for debugging
            return applyPlugins(product);
        },

        generateOrder(options = {}) {
            const { seed, locale, productCount = 3 } = options;
            if (seed) setSeed(seed);
            if (locale) setLocale(locale);

            if (productCount <= 0) {
                throw new Error('Product count must be a positive number');
            }

            const products = Array.from({ length: productCount }, () => this.generateProduct());
            return applyPlugins({
                id: faker.string.uuid(),
                customerName: faker.person.fullName(),
                orderDate: faker.date.recent(),
                products: products,
                totalAmount: products.reduce((sum, product) => sum + product.price, 0),
                shippingAddress: {
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    zipCode: faker.location.zipCode(),
                    country: faker.location.country()
                }
            });
        },

        generateReview(options = {}) {
            const { seed, locale, productId } = options;
            if (seed !== undefined) {
                faker.seed(seed);
            }
            if (locale) setLocale(locale);

            let comment = faker.lorem.paragraph();
            if (locale === 'de') {
                const germanChars = 'äöüßÄÖÜ';
                const randomChar = germanChars[Math.floor(Math.random() * germanChars.length)];
                comment = comment.replace(/[a-z]/i, randomChar);
            }

            const review = {
                id: faker.number.int({ min: 10000, max: 99999 }).toString(), // Use a number instead of UUID
                productId: productId || faker.number.int({ min: 10000, max: 99999 }).toString(),
                rating: faker.number.int({ min: 1, max: 5 }),
                comment: comment,
                reviewerName: faker.person.fullName(),
                reviewDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0], // Use only the date part
                helpful: faker.number.int({ min: 0, max: 100 }),
                verified: faker.datatype.boolean()
            };

            return applyPlugins(review);
        },

        generateCategory(options = {}) {
            const { seed, locale, parentId = null } = options;
            if (seed) setSeed(seed);
            if (locale) setLocale(locale);

            return applyPlugins({
                id: faker.string.uuid(),
                name: faker.commerce.department(),
                description: faker.commerce.productDescription(),
                parentId,
                slug: faker.helpers.slugify(faker.commerce.department().toLowerCase()),
                isActive: faker.datatype.boolean()
            });
        },

        generateInventory(productId, options = {}) {
            const { seed, locale } = options;
            if (seed) setSeed(seed);
            if (locale) setLocale(locale);

            return applyPlugins({
                productId,
                quantity: faker.number.int({ min: 0, max: 1000 }),
                lastUpdated: faker.date.recent(),
                warehouseLocation: faker.location.city(),
                reorderPoint: faker.number.int({ min: 10, max: 100 })
            });
        },

        generateCoupon(options = {}) {
            const { seed, locale } = options;
            if (seed) setSeed(seed);
            if (locale) setLocale(locale);

            return applyPlugins({
                code: faker.string.alphanumeric(8).toUpperCase(),
                discountType: faker.helpers.arrayElement(['percentage', 'fixed']),
                discountValue: faker.number.int({ min: 5, max: 50 }),
                expirationDate: faker.date.future(),
                minPurchaseAmount: faker.number.int({ min: 0, max: 100 }),
                isActive: faker.datatype.boolean()
            });
        },

        generateShippingMethod(options = {}) {
            const { seed, locale } = options;
            if (seed) setSeed(seed);
            if (locale) setLocale(locale);

            return applyPlugins({
                id: faker.string.uuid(),
                name: faker.helpers.arrayElement(['Standard', 'Express', 'Overnight']),
                price: parseFloat(faker.commerce.price({ min: 5, max: 50 })),
                estimatedDeliveryDays: faker.number.int({ min: 1, max: 10 }),
                provider: faker.company.name(),
                isAvailable: faker.datatype.boolean()
            });
        },

        generatePaymentMethod(options = {}) {
            const { seed, locale } = options;
            if (seed) setSeed(seed);
            if (locale) setLocale(locale);

            return applyPlugins({
                id: faker.string.uuid(),
                type: faker.helpers.arrayElement(['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery']),
                name: faker.finance.accountName(),
                isDefault: faker.datatype.boolean(),
                lastFour: faker.finance.creditCardNumber('####'),
                expiryDate: faker.date.future()
            });
        },

        generateRelatedProducts(mainProductId, count = 3, options = {}) {
            const { seed, locale } = options;
            if (seed) setSeed(seed);
            if (locale) setLocale(locale);

            const relatedProducts = this.generateBulk(this.generateProduct, count, options);
            return relatedProducts.map(product => ({
                ...product,
                relatedToProductId: mainProductId
            }));
        },

        generateProductWithRelations(options = {}) {
            const { seed, locale, relatedProductCount = 3 } = options;
            if (seed) setSeed(seed);
            if (locale) setLocale(locale);

            const mainProduct = this.generateProduct(options);
            const relatedProducts = this.generateRelatedProducts(mainProduct.id, relatedProductCount, options);
            return {
                ...mainProduct,
                relatedProducts
            };
        }
    };

    return generator;
}

module.exports = dataGenerator;