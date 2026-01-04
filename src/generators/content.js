const { initFaker } = require('../utils/faker-utils');

/**
 * Create content/media generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} Content generator methods
 */
const createContentGenerators = (applyPlugins) => ({
    /**
     * Generate blog post data
     * @param {Object} options - Generation options
     * @returns {Object} Generated blog post data
     */
    generateBlogPost(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        const publishedAt = f.date.past({ years: 2 });

        return applyPlugins({
            id: f.string.uuid(),
            slug: f.helpers.slugify(f.lorem.words(5).toLowerCase()),
            title: f.lorem.sentence({ min: 5, max: 12 }),
            excerpt: f.lorem.paragraph(),
            content: f.lorem.paragraphs(8),
            featuredImage: f.image.url(),
            status: f.helpers.arrayElement(['draft', 'published', 'scheduled', 'archived']),
            author: {
                id: f.string.uuid(),
                name: f.person.fullName(),
                avatar: f.image.avatar(),
                bio: f.lorem.sentence()
            },
            category: f.helpers.arrayElement(['Technology', 'Business', 'Lifestyle', 'Travel', 'Food', 'Health', 'Finance']),
            tags: Array.from({ length: f.number.int({ min: 2, max: 6 }) }, () => f.lorem.word()),
            readingTime: f.number.int({ min: 2, max: 20 }),
            views: f.number.int({ min: 0, max: 100000 }),
            likes: f.number.int({ min: 0, max: 5000 }),
            commentsCount: f.number.int({ min: 0, max: 200 }),
            isFeatured: f.datatype.boolean(),
            allowComments: f.datatype.boolean(),
            seo: {
                metaTitle: f.lorem.sentence({ min: 5, max: 10 }),
                metaDescription: f.lorem.sentence({ min: 10, max: 20 }),
                keywords: Array.from({ length: f.number.int({ min: 3, max: 8 }) }, () => f.lorem.word())
            },
            publishedAt: publishedAt.toISOString(),
            updatedAt: f.date.between({ from: publishedAt, to: new Date() }).toISOString()
        });
    },

    /**
     * Generate event data
     * @param {Object} options - Generation options
     * @returns {Object} Generated event data
     */
    generateEvent(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        const startDate = f.date.future({ years: 1 });
        const endDate = new Date(startDate.getTime() + f.number.int({ min: 1, max: 72 }) * 60 * 60 * 1000);
        const capacity = f.number.int({ min: 10, max: 1000 });

        return applyPlugins({
            id: f.string.uuid(),
            name: f.lorem.sentence({ min: 3, max: 8 }),
            description: f.lorem.paragraphs(3),
            type: f.helpers.arrayElement(['conference', 'workshop', 'meetup', 'webinar', 'concert', 'festival', 'networking', 'exhibition']),
            status: f.helpers.arrayElement(['draft', 'published', 'cancelled', 'postponed', 'completed']),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            timezone: f.location.timeZone(),
            venue: {
                name: f.company.name() + ' ' + f.helpers.arrayElement(['Center', 'Hall', 'Arena', 'Theater']),
                address: f.location.streetAddress(),
                city: f.location.city(),
                country: f.location.country(),
                coordinates: {
                    latitude: f.location.latitude(),
                    longitude: f.location.longitude()
                }
            },
            isVirtual: f.datatype.boolean(),
            virtualUrl: f.helpers.maybe(() => f.internet.url()) || null,
            coverImage: f.image.url(),
            organizer: {
                id: f.string.uuid(),
                name: f.company.name(),
                email: f.internet.email(),
                logo: f.image.url()
            },
            speakers: Array.from({ length: f.number.int({ min: 1, max: 5 }) }, () => ({
                id: f.string.uuid(),
                name: f.person.fullName(),
                title: f.person.jobTitle(),
                avatar: f.image.avatar(),
                bio: f.lorem.sentence()
            })),
            tickets: Array.from({ length: f.number.int({ min: 1, max: 3 }) }, () => ({
                id: f.string.uuid(),
                name: f.helpers.arrayElement(['General Admission', 'VIP', 'Early Bird', 'Student']),
                price: parseFloat(f.commerce.price({ min: 0, max: 500 })),
                currency: f.finance.currencyCode(),
                available: f.number.int({ min: 0, max: 500 })
            })),
            capacity,
            registrations: f.number.int({ min: 0, max: capacity }),
            categories: Array.from({ length: f.number.int({ min: 1, max: 3 }) }, () => f.lorem.word()),
            isFree: f.datatype.boolean(),
            registrationDeadline: f.date.between({ from: new Date(), to: startDate }).toISOString()
        });
    }
});

module.exports = createContentGenerators;
