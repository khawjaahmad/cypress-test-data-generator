import { expectValidProperty } from '../support/schemas';

describe('Real Estate Generators', () => {
  describe('Property Generator', () => {
    context('Basic Generation', () => {
      it('generates valid property with default options', () => {
        cy.task('generateProperty').then(expectValidProperty);
      });

      it('generates property with valid address structure', () => {
        cy.task('generateProperty').then((property) => {
          expect(property.address).to.have.all.keys(
            'street', 'city', 'state', 'zipCode', 'country', 'coordinates'
          );
          expect(property.address.coordinates).to.have.all.keys('latitude', 'longitude');
          expect(property.address.coordinates.latitude).to.be.a('number');
          expect(property.address.coordinates.longitude).to.be.a('number');
        });
      });

      it('generates property with valid specifications', () => {
        cy.task('generateProperty').then((property) => {
          expect(property.bedrooms).to.be.a('number').and.to.be.at.least(0);
          expect(property.bathrooms).to.be.a('number').and.to.be.at.least(1);
          expect(property.squareFeet).to.be.a('number').and.to.be.at.least(500);
          expect(property.yearBuilt).to.be.a('number').and.to.be.at.least(1920);
          expect(property.lotSize).to.be.a('number');
          expect(property.pricePerSqFt).to.be.a('number');
        });
      });

      it('generates property with valid features array', () => {
        cy.task('generateProperty').then((property) => {
          expect(property.features).to.be.an('array').and.to.have.length.at.least(3);
          const validFeatures = [
            'Swimming Pool', 'Garage', 'Garden', 'Fireplace', 'Central AC',
            'Hardwood Floors', 'Granite Counters', 'Stainless Appliances',
            'Walk-in Closet', 'Smart Home', 'Solar Panels', 'Security System'
          ];
          property.features.forEach((feature) => {
            expect(feature).to.be.oneOf(validFeatures);
          });
        });
      });

      it('generates property with valid agent structure', () => {
        cy.task('generateProperty').then((property) => {
          expect(property.agent).to.have.all.keys('id', 'name', 'phone', 'email', 'company', 'photo');
          expect(property.agent.id).to.be.a('string');
          expect(property.agent.name).to.be.a('string');
        });
      });

      it('generates property with images array', () => {
        cy.task('generateProperty').then((property) => {
          expect(property.images).to.be.an('array').and.to.have.length.at.least(3);
          property.images.forEach((image) => {
            expect(image).to.be.a('string');
          });
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates properties with same core data using same seed', () => {
        const seed = 12345;
        cy.task('generateProperty', { seed }).then((prop1) => {
          cy.task('generateProperty', { seed }).then((prop2) => {
            expect(prop1.id).to.equal(prop2.id);
            expect(prop1.listingId).to.equal(prop2.listingId);
            expect(prop1.type).to.equal(prop2.type);
            expect(prop1.agent.name).to.equal(prop2.agent.name);
          });
        });
      });
    });
  });
});
