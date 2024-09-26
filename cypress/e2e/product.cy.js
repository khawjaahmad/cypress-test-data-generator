describe('Product Data Generation Tests', () => {
    context('Basic Product Generation', () => {
      it('should generate a valid product', () => {
        cy.task('generateProduct').then((product) => {
          expect(product).to.have.all.keys(
            'id', 'name', 'description', 'price', 'category', 'inStock',
            'image', 'sku', 'relatedProducts'
          );
          expect(product.id).to.be.a('string');
          expect(product.name).to.be.a('string');
          expect(product.description).to.be.a('string');
          expect(product.price).to.be.a('number');
          expect(product.category).to.be.a('string');
          expect(product.inStock).to.be.a('boolean');
          expect(product.image).to.be.a('string');
          expect(product.sku).to.be.a('string');
          expect(product.relatedProducts).to.be.an('array');
        });
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
        cy.task('generateProduct', { locale: 'de' }).then((product) => {
          // Check if the description contains German-specific characters
          expect(product.description).to.match(/[äöüßÄÖÜ]/);
          
          // Log the product details for debugging
          console.log('Generated product:', product);
        });
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
  
      it('should handle generating a product with no related products', () => {
        cy.task('generateProductWithRelations', { relatedProductCount: 0 }).then((product) => {
          expect(product.relatedProducts).to.have.length(0);
        });
      });
    });
  
    context('Edge Cases and Error Handling', () => {
      it('should handle invalid locale gracefully', () => {
        cy.task('generateProduct', { locale: 'invalid_locale' }).then((product) => {
          expect(product).to.not.have.property('error');
        });
      });
  
      it('should handle extremely large related product count', () => {
        cy.task('generateProductWithRelations', { relatedProductCount: 1000 }).then((product) => {
          expect(product.relatedProducts.length).to.be.at.least(1);
        });
      });
  
      it('should handle negative related product count', () => {
        cy.task('generateProductWithRelations', { relatedProductCount: -5 }).then((product) => {
          expect(product.relatedProducts).to.have.length(0);
        });
      });
    });
  
    context('Product Inventory', () => {
      it('should generate inventory for a product', () => {
        cy.task('generateProduct').then((product) => {
          cy.task('generateInventory', product.id).then((inventory) => {
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
            expect(review).to.have.all.keys(
              'id', 'productId', 'rating', 'comment', 'reviewerName',
              'reviewDate', 'helpful', 'verified'
            );
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
        cy.task('generateCategory').then((category) => {
          expect(category).to.have.all.keys(
            'id', 'name', 'description', 'parentId', 'slug', 'isActive'
          );
        });
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
          order.products.forEach(product => {
            expect(product).to.have.all.keys(
              'id', 'name', 'description', 'price', 'category', 'inStock',
              'image', 'sku', 'relatedProducts'
            );
          });
        });
      });
    });
  });