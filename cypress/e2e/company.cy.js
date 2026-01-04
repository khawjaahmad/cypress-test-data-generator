import { expectValidCompany } from '../support/schemas';

describe('Company Data Generator', () => {
  context('Basic Generation', () => {
    it('generates valid company data with default options', () => {
      cy.task('generateCompany').then(expectValidCompany);
    });
  });

  context('Seed Functionality', () => {
    it('generates identical company data with the same seed', () => {
      const seed = 12345;
      cy.task('generateCompany', { seed }).then((company1) => {
        cy.task('generateCompany', { seed }).then((company2) => {
          expect(company1).to.deep.equal(company2);
        });
      });
    });

    it('generates different company data with different seeds', () => {
      cy.task('generateCompany', { seed: 12345 }).then((company1) => {
        cy.task('generateCompany', { seed: 67890 }).then((company2) => {
          expect(company1).to.not.deep.equal(company2);
        });
      });
    });
  });

  context('Locale Support', () => {
    it('generates company data with a specific locale', () => {
      cy.task('generateCompany', { locale: 'de' }).then(expectValidCompany);
    });

    it('falls back to default locale for unsupported locale', () => {
      cy.task('generateCompany', { locale: 'xx' }).then(expectValidCompany);
    });
  });

  context('Edge Cases', () => {
    it('handles minimum employee count', () => {
      cy.task('generateCompany').then((company) => {
        expect(company.employees).to.be.at.least(1);
      });
    });

    it('handles maximum employee count', () => {
      cy.task('generateCompany').then((company) => {
        expect(company.employees).to.be.at.most(100000);
      });
    });
  });

  context('Negative Cases', () => {
    it('handles invalid seed gracefully', () => {
      cy.task('generateCompany', { seed: 'invalid-seed' }).then(expectValidCompany);
    });

    it('handles missing options gracefully', () => {
      cy.task('generateCompany', null).then(expectValidCompany);
    });
  });
});
