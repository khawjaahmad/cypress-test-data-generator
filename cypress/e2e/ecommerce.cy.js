import {
  expectValidCart,
  expectValidCartItem,
  expectValidWishlist,
  expectValidReturn
} from '../support/schemas';

describe('E-commerce Extension Generators', () => {
  describe('Cart Generator', () => {
    context('Basic Generation', () => {
      it('generates valid cart with default options', () => {
        cy.task('generateCart').then(expectValidCart);
      });

      it('generates cart with specific item count', () => {
        cy.task('generateCart', { itemCount: 5 }).then((cart) => {
          expect(cart.items).to.have.length(5);
        });
      });

      it('generates cart items with correct structure', () => {
        cy.task('generateCart').then((cart) => {
          cart.items.forEach(expectValidCartItem);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates carts with same core data using same seed', () => {
        const seed = 12345;
        cy.task('generateCart', { seed }).then((cart1) => {
          cy.task('generateCart', { seed }).then((cart2) => {
            expect(cart1.id).to.equal(cart2.id);
            expect(cart1.userId).to.equal(cart2.userId);
            expect(cart1.subtotal).to.equal(cart2.subtotal);
            expect(cart1.items.length).to.equal(cart2.items.length);
          });
        });
      });
    });
  });

  describe('Wishlist Generator', () => {
    context('Basic Generation', () => {
      it('generates valid wishlist with default options', () => {
        cy.task('generateWishlist').then(expectValidWishlist);
      });

      it('generates wishlist with specific item count', () => {
        cy.task('generateWishlist', { itemCount: 3 }).then((wishlist) => {
          expect(wishlist.items).to.have.length(3);
          expect(wishlist.totalItems).to.equal(3);
        });
      });

      it('generates wishlist items with correct structure', () => {
        cy.task('generateWishlist').then((wishlist) => {
          wishlist.items.forEach((item) => {
            expect(item).to.have.all.keys(
              'id', 'productId', 'productName', 'productImage', 'price',
              'originalPrice', 'inStock', 'addedAt', 'priority', 'notes'
            );
            expect(item.priority).to.be.oneOf(['low', 'medium', 'high']);
          });
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates wishlists with same core data using same seed', () => {
        const seed = 54321;
        cy.task('generateWishlist', { seed }).then((w1) => {
          cy.task('generateWishlist', { seed }).then((w2) => {
            expect(w1.id).to.equal(w2.id);
            expect(w1.userId).to.equal(w2.userId);
            expect(w1.name).to.equal(w2.name);
            expect(w1.totalItems).to.equal(w2.totalItems);
          });
        });
      });
    });
  });

  describe('Return Generator', () => {
    context('Basic Generation', () => {
      it('generates valid return with default options', () => {
        cy.task('generateReturn').then(expectValidReturn);
      });

      it('generates return with specific order ID', () => {
        const orderId = 'order-123';
        cy.task('generateReturn', { orderId }).then((returnRequest) => {
          expect(returnRequest.orderId).to.equal(orderId);
        });
      });

      it('generates return items with correct structure', () => {
        cy.task('generateReturn').then((returnRequest) => {
          expect(returnRequest.items).to.be.an('array').and.to.have.length.at.least(1);
          returnRequest.items.forEach((item) => {
            expect(item).to.have.all.keys('productId', 'productName', 'quantity', 'price');
          });
        });
      });

      it('generates return with valid reason', () => {
        cy.task('generateReturn').then((returnRequest) => {
          const validReasons = [
            'Defective product', 'Wrong item received', 'Item not as described',
            'Changed mind', 'Better price found', 'Arrived too late',
            'Damaged in shipping', 'Size/fit issue'
          ];
          expect(returnRequest.reason).to.be.oneOf(validReasons);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates returns with same core data using same seed', () => {
        const seed = 99999;
        cy.task('generateReturn', { seed }).then((r1) => {
          cy.task('generateReturn', { seed }).then((r2) => {
            expect(r1.id).to.equal(r2.id);
            expect(r1.orderId).to.equal(r2.orderId);
            expect(r1.status).to.equal(r2.status);
            expect(r1.reason).to.equal(r2.reason);
          });
        });
      });
    });
  });
});
