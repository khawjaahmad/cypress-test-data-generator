describe('Review Data Generation Tests', () => {
    context('Basic Review Generation', () => {
      it('should generate a valid review', () => {
        cy.task('generateReview').then((review) => {
          expect(review).to.have.all.keys(
            'id', 'productId', 'rating', 'comment', 'reviewerName',
            'reviewDate', 'helpful', 'verified'
          );
          expect(review.id).to.be.a('string');
          expect(review.productId).to.be.a('string');
          expect(review.rating).to.be.a('number').and.to.be.within(1, 5);
          expect(review.comment).to.be.a('string');
          expect(review.reviewerName).to.be.a('string');
          // Check if reviewDate is a valid date string
          expect(review.reviewDate).to.be.a('string');
          expect(new Date(review.reviewDate)).to.be.a('date');
          expect(review.helpful).to.be.a('number').and.to.be.at.least(0);
          expect(review.verified).to.be.a('boolean');
        });
      });
  
      it('should generate multiple unique reviews', () => {
        const reviewCount = 5;
        const reviews = [];
  
        Cypress._.times(reviewCount, () => {
          cy.task('generateReview').then((review) => {
            reviews.push(review);
          });
        });
  
        cy.wrap(reviews).should('have.length', reviewCount);
        cy.wrap(reviews).then((reviews) => {
          const uniqueIds = new Set(reviews.map(r => r.id));
          expect(uniqueIds.size).to.equal(reviewCount);
        });
      });
    });
  
    context('Review Generation with Options', () => {
      it('should generate a review with a specific seed', () => {
        const seed = 12345;
        cy.task('generateReview', { seed }).then((review1) => {
          cy.task('generateReview', { seed }).then((review2) => {
            // Compare all fields
            expect(review1).to.deep.equal(review2);
            
            // Additional checks for specific fields
            expect(review1.id).to.be.a('string');
            expect(review1.rating).to.be.a('number').and.to.be.within(1, 5);
            expect(review1.comment).to.be.a('string');
            expect(review1.reviewerName).to.be.a('string');
            expect(review1.reviewDate).to.be.a('string');
            expect(new Date(review1.reviewDate)).to.be.a('date');
            expect(review1.helpful).to.be.a('number').and.to.be.at.least(0);
            expect(review1.verified).to.be.a('boolean');
          });
        });
      });
  
      it('should generate a review with a specific locale', () => {
        cy.task('generateReview', { locale: 'de' }).then((review) => {
          // Check if the comment contains German-specific characters
          expect(review.comment).to.match(/[äöüßÄÖÜ]/);
        });
      });
  
      it('should generate a review for a specific product', () => {
        const productId = 'test-product-123';
        cy.task('generateReview', { productId }).then((review) => {
          expect(review.productId).to.equal(productId);
        });
      });
    });
  
    context('Review Properties', () => {
      it('should generate a review with a valid rating', () => {
        cy.task('generateReview').then((review) => {
          expect(review.rating).to.be.a('number').and.to.be.within(1, 5);
        });
      });
  
      it('should generate a review with a non-empty comment', () => {
        cy.task('generateReview').then((review) => {
          expect(review.comment).to.be.a('string').and.to.have.length.greaterThan(0);
        });
      });
  
      it('should generate a review with a recent date', () => {
        cy.task('generateReview').then((review) => {
          const reviewDate = new Date(review.reviewDate);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          expect(reviewDate.getTime()).to.be.at.least(oneMonthAgo.getTime());
          expect(reviewDate.getTime()).to.be.at.most(Date.now());
        });
      });
    });
  
    context('Edge Cases and Error Handling', () => {
      it('should handle invalid locale gracefully', () => {
        cy.task('generateReview', { locale: 'invalid_locale' }).then((review) => {
          expect(review).to.not.have.property('error');
          expect(review).to.have.all.keys(
            'id', 'productId', 'rating', 'comment', 'reviewerName',
            'reviewDate', 'helpful', 'verified'
          );
        });
      });
  
      it('should generate a review with minimum helpful count', () => {
        cy.task('generateReview').then((review) => {
          expect(review.helpful).to.be.at.least(0);
        });
      });
    });
  
    context('Review in Product Context', () => {
      it('should generate a review for a generated product', () => {
        cy.task('generateProduct').then((product) => {
          cy.task('generateReview', { productId: product.id }).then((review) => {
            expect(review.productId).to.equal(product.id);
          });
        });
      });
  
      it('should generate multiple reviews for a single product', () => {
        cy.task('generateProduct').then((product) => {
          const reviewCount = 3;
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
  });