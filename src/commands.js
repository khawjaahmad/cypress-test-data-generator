/**
 * Native Cypress commands for cypress-test-data-generator.
 *
 * Usage:
 *   // cypress/support/e2e.js
 *   import 'cypress-test-data-generator/commands';
 *
 * Tasks must also be registered in cypress.config.js, typically via
 * `dataGenerator.registerTasks(on, config)`.
 */

/* eslint-env browser */
/* global Cypress, cy */

const PASSTHROUGH_COMMANDS = [
    'generateUser',
    'generateAddress',
    'generateProduct',
    'generateProductWithRelations',
    'generateOrder',
    'generateReview',
    'generateCategory',
    'generateCoupon',
    'generateShippingMethod',
    'generatePaymentMethod',
    'generateCart',
    'generateWishlist',
    'generateReturn',
    'generateSocialProfile',
    'generateComment',
    'generateNotification',
    'generateMessage',
    'generateCompany',
    'generateInvoice',
    'generateEmployee',
    'generateProject',
    'generateTicket',
    'generateMeeting',
    'generateJobListing',
    'generateCreditCard',
    'generateTransaction',
    'generateBankAccount',
    'generateLoan',
    'generateInsurancePolicy',
    'generateSubscription',
    'generateBlogPost',
    'generateEvent',
    'generateTravelItinerary',
    'generateVehicle',
    'generateProperty',
    'generateRestaurant',
    'generateMenuItem',
    'generateFoodOrder',
    'generateApiResponse',
    'generateLogEntry',
    'generateMedicalRecord',
    'generateEducation',
    'generateScenario',
];

for (const name of PASSTHROUGH_COMMANDS) {
    Cypress.Commands.add(name, (options) => cy.task(name, options));
}

// generateInventory takes (productId, options) — wrap so consumers can call
// cy.generateInventory('p-1', { seed: 1 }) without knowing the task shape.
Cypress.Commands.add('generateInventory', (productId, options) =>
    cy.task('generateInventory', { productId, options })
);

Cypress.Commands.add('generateBulk', (generator, count, options) =>
    cy.task('generateBulk', { generator, count, options })
);

// Short alias so specs can read `cy.scenario({ ... })` instead of the longer
// `cy.generateScenario(...)`.
Cypress.Commands.add('scenario', (options) =>
    cy.task('generateScenario', options)
);

/**
 * Install a cy.intercept that serves generated data.
 *
 * @example
 * cy.mockApi('/api/users', { generator: 'generateUser', count: 20, paginated: true });
 *
 * @example
 * cy.mockApi('/api/users/999', { status: 404, body: { error: 'not found' } });
 *
 * @example
 * cy.mockApi('/api/bootstrap', { scenario: { users: 3, ordersPerUser: 2 } });
 */
Cypress.Commands.add('mockApi', (url, options = {}) => {
    const {
        method = 'GET',
        generator,
        count = 10,
        seed,
        locale,
        paginated = false,
        page = 1,
        pageSize,
        total,
        status = 200,
        headers,
        delay,
        body,
        scenario,
        transform,
    } = options;

    const effectivePageSize = pageSize ?? count;
    const effectiveTotal = total ?? count;

    if (body !== undefined) {
        installIntercept(method, url, status, body, headers, delay);
        return cy.wrap(body, { log: false });
    }

    if (scenario) {
        return cy.task('generateScenario', scenario).then((bundle) => {
            const final = transform ? transform(bundle) : bundle;
            installIntercept(method, url, status, final, headers, delay);
            return cy.wrap(final, { log: false });
        });
    }

    if (!generator) {
        throw new Error(
            'cy.mockApi requires one of: `generator`, `body`, or `scenario`'
        );
    }

    return cy
        .task('generateBulk', {
            generator,
            count,
            options: { seed, locale },
        })
        .then((items) => {
            const payload = paginated
                ? {
                      data: items,
                      meta: {
                          page,
                          pageSize: effectivePageSize,
                          total: effectiveTotal,
                          totalPages: Math.ceil(effectiveTotal / effectivePageSize),
                      },
                  }
                : items;
            const final = transform ? transform(payload) : payload;
            installIntercept(method, url, status, final, headers, delay);
            return cy.wrap(final, { log: false });
        });
});

function installIntercept(method, url, status, body, headers, delay) {
    const response = { statusCode: status, body };
    if (headers) response.headers = headers;
    if (delay !== undefined) response.delay = delay;
    cy.intercept({ method, url }, response);
}
