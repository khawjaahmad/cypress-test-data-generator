describe('User Data Generation', () => {
    it('generates a valid user with default options', () => {
      cy.task('generateUser').then((user) => {
        expect(user).to.have.property('firstName').and.to.be.a('string');
        expect(user).to.have.property('lastName').and.to.be.a('string');
        expect(user).to.have.property('email').and.to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        expect(user).to.have.property('age').and.to.be.a('number').and.to.be.within(18, 99);
        expect(user).to.have.property('address').and.to.be.an('object');
        expect(user.address).to.have.all.keys('street', 'city', 'state', 'zipCode', 'country');
      });
    });
  
    it('generates a user with custom age range', () => {
      cy.task('generateUser', { ageRange: { min: 25, max: 35 } }).then((user) => {
        expect(user.age).to.be.within(25, 35);
      });
    });
  
    it('generates a user with specific locale', () => {
      cy.task('generateUser', { locale: 'fr' }).then((user) => {
        expect(user).to.have.property('firstName');
        expect(user).to.have.property('lastName');
        // We can't guarantee the name will be French, but we can check if it's a string
        expect(user.firstName).to.be.a('string');
        expect(user.lastName).to.be.a('string');
      });
    });
  
    it('throws an error for invalid age range', () => {
      cy.task('generateUser', { ageRange: { min: 40, max: 30 } }).then((result) => {
        expect(result).to.have.property('error');
        expect(result.error).to.include('Max 30 should be greater than min 40');
      });
    });
  
    it('generates a user with a specific country', () => {
      cy.task('generateUser', { country: 'Canada' }).then((user) => {
        expect(user.address.country).to.equal('Canada');
      });
    });
  
    it('generates a user with a custom seed', () => {
      const seed = 12345;
      cy.task('generateUser', { seed }).then((user1) => {
        cy.task('generateUser', { seed }).then((user2) => {
          expect(user1).to.deep.equal(user2);
        });
      });
    });
  
    it('generates users with different seeds', () => {
      cy.task('generateUser', { seed: 12345 }).then((user1) => {
        cy.task('generateUser', { seed: 67890 }).then((user2) => {
          expect(user1).to.not.deep.equal(user2);
        });
      });
    });
  
    it('generates a user with custom age min and max', () => {
      cy.task('generateUser', { ageMin: 40, ageMax: 50 }).then((user) => {
        expect(user.age).to.be.within(40, 50);
      });
    });
  
    it('generates a user with only ageMin specified', () => {
      cy.task('generateUser', { ageMin: 60 }).then((user) => {
        expect(user.age).to.be.at.least(60);
      });
    });
  
    it('generates a user with only ageMax specified', () => {
      cy.task('generateUser', { ageMax: 30 }).then((user) => {
        expect(user.age).to.be.at.most(30);
      });
    });
  
    it('throws an error when ageMin is greater than ageMax', () => {
      cy.task('generateUser', { ageMin: 50, ageMax: 40 }).then((result) => {
        expect(result).to.have.property('error');
        expect(result.error).to.include('Max 40 should be greater than min 50');
      });
    });
  
    it('generates a valid email address', () => {
      cy.task('generateUser').then((user) => {
        expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  
    it('generates consistent data with the same seed', () => {
      const seed = 54321;
      cy.task('generateUser', { seed }).then((user1) => {
        cy.task('generateUser', { seed }).then((user2) => {
          expect(user1).to.deep.equal(user2);
        });
      });
    });
  
    it('generates different data with different seeds', () => {
      cy.task('generateUser', { seed: 11111 }).then((user1) => {
        cy.task('generateUser', { seed: 22222 }).then((user2) => {
          expect(user1).to.not.deep.equal(user2);
        });
      });
    });
  
    it('generates a user with a complete address', () => {
      cy.task('generateUser').then((user) => {
        expect(user.address).to.have.property('street').and.to.be.a('string');
        expect(user.address).to.have.property('city').and.to.be.a('string');
        expect(user.address).to.have.property('state').and.to.be.a('string');
        expect(user.address).to.have.property('zipCode').and.to.be.a('string');
        expect(user.address).to.have.property('country').and.to.be.a('string');
      });
    });
  
    it('generates users with unique IDs', () => {
      cy.task('generateUser').then((user1) => {
        cy.task('generateUser').then((user2) => {
          expect(user1).to.have.property('id').and.to.be.a('string');
          expect(user2).to.have.property('id').and.to.be.a('string');
          expect(user1.id).to.not.equal(user2.id);
        });
      });
    });
  
    it('falls back to default locale for unsupported locale', () => {
      cy.task('generateUser', { locale: 'xx' }).then((user) => {
        expect(user).to.have.property('firstName');
        expect(user).to.have.property('lastName');
        expect(user.firstName).to.be.a('string');
        expect(user.lastName).to.be.a('string');
      });
    });
  
    it('returns an error when ageMin is greater than ageMax', () => {
      cy.task('generateUser', { ageMin: 50, ageMax: 40 }).then((result) => {
        expect(result).to.have.property('error');
        expect(result.error).to.include('Max 40 should be greater than min 50');
      });
    });
  });