describe('Native Cypress commands', () => {
  it('cy.generateUser returns a valid user (no cy.task boilerplate)', () => {
    cy.generateUser({ seed: 1 }).then((user) => {
      expect(user.id).to.be.a('string');
      expect(user.firstName).to.be.a('string');
      expect(user.address.city).to.be.a('string');
    });
  });

  it('cy.generateUser chains into .as() alias', () => {
    cy.generateUser({ seed: 1 }).as('testUser');
    cy.get('@testUser').should((u) => {
      expect(u.email).to.be.a('string');
    });
  });

  it('cy.generateProduct accepts customFields', () => {
    cy.generateProduct({ customFields: { vendor: 'acme' } }).then((p) => {
      expect(p.vendor).to.equal('acme');
    });
  });

  it('cy.generateInventory hides the (productId, options) task shape', () => {
    cy.generateInventory('p-42', { seed: 1 }).then((inv) => {
      expect(inv.productId).to.equal('p-42');
    });
  });

  it('cy.generateBulk is chainable and typed', () => {
    cy.generateBulk('generateUser', 5, { seed: 1 }).then((users) => {
      expect(users).to.have.length(5);
      users.forEach((u) => expect(u.firstName).to.be.a('string'));
    });
  });

  it('cy.scenario produces a relational bundle', () => {
    cy.scenario({ users: 2, ordersPerUser: 1 }).then((s) => {
      expect(s.users).to.have.length(2);
      expect(s.orders).to.have.length(2);
    });
  });
});
