// cy.intercept only catches requests made from the browser. Each test
// loads a minimal HTML page served by a separate intercept, then uses
// window.fetch to hit the mocked endpoint.
const HOST = 'http://mock.test';

const visitBlank = () => {
    cy.intercept('GET', `${HOST}/__blank__`, {
        statusCode: 200,
        headers: { 'content-type': 'text/html' },
        body: '<!doctype html><html><head></head><body></body></html>',
    });
    cy.visit(`${HOST}/__blank__`);
};

const fetchJson = (url) =>
    cy
        .window()
        .then((win) => win.fetch(url).then((r) => r.json().then((body) => ({ status: r.status, body }))));

describe('cy.mockApi — one-line intercept + generated data', () => {
    beforeEach(visitBlank);

    it('resolves with the generated body', () => {
        cy.mockApi(`${HOST}/api/users`, {
            generator: 'generateUser',
            count: 3,
            seed: 1,
        }).then((body) => {
            expect(body).to.have.length(3);
            expect(body[0]).to.have.property('firstName');
        });
    });

    it('serves generated data when the browser fetches the URL', () => {
        cy.mockApi(`${HOST}/api/users`, {
            generator: 'generateUser',
            count: 3,
            seed: 1,
        });
        fetchJson(`${HOST}/api/users`).then(({ status, body }) => {
            expect(status).to.equal(200);
            expect(body).to.have.length(3);
            expect(body[0].firstName).to.be.a('string');
        });
    });

    it('wraps response in pagination envelope when paginated:true', () => {
        cy.mockApi(`${HOST}/api/products`, {
            generator: 'generateProduct',
            count: 5,
            paginated: true,
            page: 1,
            pageSize: 5,
            total: 42,
        });
        fetchJson(`${HOST}/api/products`).then(({ body }) => {
            expect(body).to.have.keys('data', 'meta');
            expect(body.data).to.have.length(5);
            expect(body.meta).to.deep.include({
                page: 1,
                pageSize: 5,
                total: 42,
                totalPages: 9,
            });
        });
    });

    it('serves the exact body passed via { body }', () => {
        cy.mockApi(`${HOST}/api/health`, { body: { status: 'ok' } });
        fetchJson(`${HOST}/api/health`).then(({ body }) => {
            expect(body).to.deep.equal({ status: 'ok' });
        });
    });

    it('honors { status } for error-case mocking', () => {
        cy.mockApi(`${HOST}/api/users/999`, {
            status: 404,
            body: { error: 'not found' },
        });
        cy.window()
            .then((win) =>
                win
                    .fetch(`${HOST}/api/users/999`)
                    .then((r) => r.json().then((body) => ({ status: r.status, body })))
            )
            .then(({ status, body }) => {
                expect(status).to.equal(404);
                expect(body.error).to.equal('not found');
            });
    });

    it('serves a relational bundle via { scenario }', () => {
        cy.mockApi(`${HOST}/api/bootstrap`, {
            scenario: { users: 2, ordersPerUser: 1, seed: 99 },
        });
        fetchJson(`${HOST}/api/bootstrap`).then(({ body }) => {
            expect(body).to.have.keys('users', 'products', 'orders', 'reviews');
            expect(body.users).to.have.length(2);
            expect(body.orders).to.have.length(2);
            // FK integrity survived the JSON round-trip
            const userIds = new Set(body.users.map((u) => u.id));
            body.orders.forEach((o) => expect(userIds.has(o.userId)).to.be.true);
        });
    });

    it('applies transform before serving', () => {
        cy.mockApi(`${HOST}/api/top3`, {
            generator: 'generateProduct',
            count: 10,
            transform: (items) => items.slice(0, 3).map((p) => p.name),
        });
        fetchJson(`${HOST}/api/top3`).then(({ body }) => {
            expect(body).to.have.length(3);
            body.forEach((name) => expect(name).to.be.a('string'));
        });
    });

    it('throws if called without generator / body / scenario', () => {
        cy.once('fail', (err) => {
            expect(err.message).to.include('`generator`, `body`, or `scenario`');
            return false;
        });
        cy.mockApi(`${HOST}/api/missing`, {});
    });
});
