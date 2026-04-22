// Demonstrates the public `cypress-test-data-generator/schemas` subpath.
// Consumers can use these same Zod schemas to validate real API responses.

const {
    UserSchema,
    ProductSchema,
    OrderSchema,
    InvoiceSchema,
    ApiResponseSchema,
} = require('../../src/schemas');

describe('Shipped Zod schemas', () => {
    it('validates a generated user', () => {
        cy.task('generateUser').then((user) => {
            const result = UserSchema.safeParse(user);
            expect(result.success, JSON.stringify(result.error, null, 2)).to.be.true;
        });
    });

    it('validates a generated product', () => {
        cy.task('generateProduct').then((product) => {
            expect(ProductSchema.safeParse(product).success).to.be.true;
        });
    });

    it('validates a generated order (with nested product array)', () => {
        cy.task('generateOrder', { productCount: 4 }).then((order) => {
            expect(OrderSchema.safeParse(order).success).to.be.true;
        });
    });

    it('validates a generated invoice (with nested client + items)', () => {
        cy.task('generateInvoice', { itemCount: 5 }).then((invoice) => {
            expect(InvoiceSchema.safeParse(invoice).success).to.be.true;
        });
    });

    it('validates a generated API response', () => {
        cy.task('generateApiResponse', { success: true }).then((response) => {
            expect(ApiResponseSchema.safeParse(response).success).to.be.true;
        });
    });

    it('rejects data that violates the schema (negative case)', () => {
        cy.task('generateUser').then((user) => {
            const tampered = { ...user, age: 'not a number' };
            const result = UserSchema.safeParse(tampered);
            expect(result.success).to.be.false;
        });
    });
});
