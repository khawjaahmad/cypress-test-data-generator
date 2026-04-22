describe('generateScenario — relational FK integrity', () => {
  it('links every order.userId to a real user', () => {
    cy.scenario({ users: 3, ordersPerUser: 2, productsPerOrder: 4 }).then((s) => {
      const userIds = new Set(s.users.map((u) => u.id));
      s.orders.forEach((order) => {
        expect(userIds.has(order.userId), `order.userId ${order.userId}`).to.be
          .true;
      });
    });
  });

  it('orders inherit the shipping address from their user', () => {
    cy.scenario({ users: 2, ordersPerUser: 3 }).then((s) => {
      const addressByUser = Object.fromEntries(
        s.users.map((u) => [u.id, u.address])
      );
      s.orders.forEach((order) => {
        expect(order.shippingAddress).to.deep.equal(addressByUser[order.userId]);
      });
    });
  });

  it('every order product exists in the shared catalog', () => {
    cy.scenario({ users: 2, ordersPerUser: 2, productsPerOrder: 3 }).then((s) => {
      const catalogIds = new Set(s.products.map((p) => p.id));
      s.orders.forEach((order) => {
        order.products.forEach((p) => {
          expect(catalogIds.has(p.id), `product ${p.id}`).to.be.true;
        });
      });
    });
  });

  it('order.totalAmount equals sum of product prices (within float tolerance)', () => {
    cy.scenario({ users: 1, ordersPerUser: 2, productsPerOrder: 5 }).then((s) => {
      s.orders.forEach((order) => {
        const sum = order.products.reduce((acc, p) => acc + p.price, 0);
        expect(order.totalAmount).to.be.closeTo(sum, 0.01);
      });
    });
  });

  it('reviews reference real products AND real users', () => {
    cy.scenario({ users: 3, reviewsPerProduct: 2 }).then((s) => {
      const userIds = new Set(s.users.map((u) => u.id));
      const productIds = new Set(s.products.map((p) => p.id));
      s.reviews.forEach((review) => {
        expect(userIds.has(review.userId)).to.be.true;
        expect(productIds.has(review.productId)).to.be.true;
      });
    });
  });

  it('same seed → identical scenario', () => {
    cy.scenario({ users: 2, ordersPerUser: 2, seed: 42 }).then((a) => {
      cy.scenario({ users: 2, ordersPerUser: 2, seed: 42 }).then((b) => {
        expect(a.users.map((u) => u.id)).to.deep.equal(b.users.map((u) => u.id));
        expect(a.orders.map((o) => o.id)).to.deep.equal(b.orders.map((o) => o.id));
      });
    });
  });

  it('supports users-only scenarios', () => {
    cy.scenario({ users: 5 }).then((s) => {
      expect(s.users).to.have.length(5);
      expect(s.orders).to.have.length(0);
      expect(s.reviews).to.have.length(0);
    });
  });

  it('respects productsCount override (shared catalog size)', () => {
    cy.scenario({
      users: 10,
      ordersPerUser: 5,
      productsPerOrder: 2,
      productsCount: 8,
    }).then((s) => {
      expect(s.products).to.have.length(8);
      expect(s.orders).to.have.length(50);
    });
  });
});
