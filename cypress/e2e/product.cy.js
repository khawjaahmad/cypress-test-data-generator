import { expectValidProduct, expectValidCategory, expectValidReview } from '../support/schemas';

describe('Product Data Generation Tests', () => {
    context('Basic Product Generation', () => {
      it('should generate a valid product', () => {
        cy.task('generateProduct').then(expectValidProduct);
      });
  
      it('should generate multiple unique products', () => {
        const productCount = 5;
        const products = [];
  
        Cypress._.times(productCount, () => {
          cy.task('generateProduct').then((product) => {
            products.push(product);
          });
        });
  
        cy.wrap(products).should('have.length', productCount);
        cy.wrap(products).then((products) => {
          const uniqueIds = new Set(products.map(p => p.id));
          expect(uniqueIds.size).to.equal(productCount);
        });
      });
    });
  
    context('Product Generation with Options', () => {
      it('should generate a product with a specific seed', () => {
        const seed = 12345;
        cy.task('generateProduct', { seed }).then((product1) => {
          cy.task('generateProduct', { seed }).then((product2) => {
            expect(product1).to.deep.equal(product2);
          });
        });
      });
  
      it('should generate a product with a specific locale', () => {
        cy.task('generateProduct', { locale: 'de' }).then(expectValidProduct);
      });
  
      it('should generate a product with custom fields', () => {
        const customFields = {
          brand: 'TestBrand',
          weight: 1.5,
          dimensions: { length: 10, width: 5, height: 2 }
        };
        cy.task('generateProduct', { customFields }).then((product) => {
          expect(product).to.include.keys('brand', 'weight', 'dimensions');
          expect(product.brand).to.equal('TestBrand');
          expect(product.weight).to.equal(1.5);
          expect(product.dimensions).to.deep.equal({ length: 10, width: 5, height: 2 });
          console.log('Product with custom fields:', product);  // Add this line for debugging
        });
      });
    });
  
    context('Product with Related Products', () => {
      it('should generate a product with related products', () => {
        cy.task('generateProductWithRelations', { relatedProductCount: 3 }).then((product) => {
          expect(product.relatedProducts).to.have.length(3);
          product.relatedProducts.forEach(relatedProduct => {
            expect(relatedProduct.relatedToProductId).to.equal(product.id);
          });
        });
      });
  
      it('should handle generating a product with one related product', () => {
        cy.task('generateProductWithRelations', { relatedProductCount: 1 }).then((product) => {
          expect(product.relatedProducts).to.have.length(1);
        });
      });
    });

    context('Edge Cases and Error Handling', () => {
      it('should handle invalid locale gracefully', () => {
        cy.task('generateProduct', { locale: 'invalid_locale' }).then((product) => {
          expect(product).to.not.have.property('error');
        });
      });

      it('should handle large related product count', () => {
        cy.task('generateProductWithRelations', { relatedProductCount: 10 }).then((product) => {
          expect(product.relatedProducts.length).to.equal(10);
        });
      });

      it('should generate product with default related products count', () => {
        cy.task('generateProductWithRelations').then((product) => {
          expect(product.relatedProducts).to.have.length(3);
        });
      });
    });
  
    context('Product Inventory', () => {
      it('should generate inventory for a product', () => {
        cy.task('generateProduct').then((product) => {
          cy.task('generateInventory', { productId: product.id }).then((inventory) => {
            expect(inventory).to.have.all.keys(
              'productId', 'quantity', 'lastUpdated', 'warehouseLocation', 'reorderPoint'
            );
            expect(inventory.productId).to.equal(product.id);
          });
        });
      });
    });
  
    context('Product Reviews', () => {
      it('should generate a review for a product', () => {
        cy.task('generateProduct').then((product) => {
          cy.task('generateReview', { productId: product.id }).then((review) => {
            expectValidReview(review);
            expect(review.productId).to.equal(product.id);
          });
        });
      });
  
      it('should generate multiple reviews for a product', () => {
        cy.task('generateProduct').then((product) => {
          const reviewCount = 5;
          const reviews = [];
  
          Cypress._.times(reviewCount, () => {
            cy.task('generateReview', { productId: product.id }).then((review) => {
              reviews.push(review);
            });
          });
  
          cy.wrap(reviews).should('have.length', reviewCount);
          cy.wrap(reviews).then((reviews) => {
            reviews.forEach(review => {
              expect(review.productId).to.equal(product.id);
            });
          });
        });
      });
    });
  
    context('Product Categories', () => {
      it('should generate a category', () => {
        cy.task('generateCategory').then(expectValidCategory);
      });
  
      it('should generate a subcategory', () => {
        cy.task('generateCategory').then((parentCategory) => {
          cy.task('generateCategory', { parentId: parentCategory.id }).then((subcategory) => {
            expect(subcategory.parentId).to.equal(parentCategory.id);
          });
        });
      });
    });
  
    context('Product in Order', () => {
      it('should include generated products in an order', () => {
        cy.task('generateOrder', { productCount: 3 }).then((order) => {
          expect(order.products).to.have.length(3);
          order.products.forEach(expectValidProduct);
        });
      });
    });
  });