const { initFaker } = require('../utils/faker-utils');

/**
 * Create technical/API generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} Technical generator methods
 */
const createTechnicalGenerators = (applyPlugins) => ({
    /**
     * Generate API response data
     * @param {Object} options - Generation options
     * @returns {Object} Generated API response data
     */
    generateApiResponse(options = {}) {
        const { seed, locale, success = null } = options || {};
        const f = initFaker({ seed, locale });

        const isSuccess = success !== null ? success : f.datatype.boolean();
        const statusCodes = isSuccess ? [200, 201, 204] : [400, 401, 403, 404, 500, 502, 503];

        return applyPlugins({
            success: isSuccess,
            statusCode: f.helpers.arrayElement(statusCodes),
            message: isSuccess ? 'Request successful' : f.lorem.sentence(),
            data: isSuccess ? {
                id: f.string.uuid(),
                createdAt: f.date.recent().toISOString(),
                updatedAt: f.date.recent().toISOString()
            } : null,
            error: !isSuccess ? {
                code: f.string.alpha({ length: 10, casing: 'upper' }),
                message: f.lorem.sentence(),
                details: f.helpers.maybe(() => f.lorem.paragraph()) || null
            } : null,
            meta: {
                requestId: f.string.uuid(),
                timestamp: new Date().toISOString(),
                version: `v${f.number.int({ min: 1, max: 3 })}.${f.number.int({ min: 0, max: 9 })}.${f.number.int({ min: 0, max: 9 })}`,
                rateLimit: {
                    limit: 1000,
                    remaining: f.number.int({ min: 0, max: 1000 }),
                    reset: f.date.soon({ days: 0.04 }).toISOString()
                }
            },
            pagination: f.helpers.maybe(() => ({
                page: f.number.int({ min: 1, max: 100 }),
                pageSize: f.helpers.arrayElement([10, 20, 50, 100]),
                totalItems: f.number.int({ min: 0, max: 10000 }),
                totalPages: f.number.int({ min: 1, max: 100 })
            })) || null
        });
    },

    /**
     * Generate log entry data
     * @param {Object} options - Generation options
     * @returns {Object} Generated log entry data
     */
    generateLogEntry(options = {}) {
        const { seed, locale, level = null } = options || {};
        const f = initFaker({ seed, locale });

        const levels = ['debug', 'info', 'warn', 'error', 'fatal'];
        const services = ['api', 'auth', 'database', 'cache', 'queue', 'scheduler', 'webhook'];

        return applyPlugins({
            id: f.string.uuid(),
            timestamp: f.date.recent({ days: 7 }).toISOString(),
            level: level || f.helpers.arrayElement(levels),
            message: f.lorem.sentence(),
            service: f.helpers.arrayElement(services),
            environment: f.helpers.arrayElement(['development', 'staging', 'production']),
            requestId: f.string.uuid(),
            userId: f.helpers.maybe(() => f.string.uuid()) || null,
            sessionId: f.helpers.maybe(() => f.string.uuid()) || null,
            ip: f.internet.ipv4(),
            userAgent: f.internet.userAgent(),
            method: f.helpers.arrayElement(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
            path: '/' + f.system.directoryPath().split('/').slice(1, 3).join('/'),
            statusCode: f.helpers.arrayElement([200, 201, 400, 401, 403, 404, 500]),
            responseTime: f.number.int({ min: 1, max: 5000 }),
            metadata: {
                hostname: f.internet.domainName(),
                pid: f.number.int({ min: 1000, max: 65535 }),
                memory: f.number.int({ min: 100, max: 8000 })
            },
            stack: f.helpers.maybe(() => f.lorem.paragraphs(2)) || null
        });
    }
});

module.exports = createTechnicalGenerators;
