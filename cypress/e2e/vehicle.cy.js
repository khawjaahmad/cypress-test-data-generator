describe('Vehicle Data Generator', () => {
  context('Basic Generation', () => {
    it('generates a valid vehicle with default options', () => {
      cy.task('generateVehicle').then((vehicle) => {
        expect(vehicle).to.have.all.keys('id', 'make', 'model', 'type', 'color', 'fuelType', 'year', 'mileage', 'price', 'vin', 'licensePlate');
        expect(vehicle.id).to.be.a('string');
        expect(vehicle.make).to.be.a('string');
        expect(vehicle.model).to.be.a('string');
        expect(vehicle.type).to.be.a('string');
        expect(vehicle.color).to.be.a('string');
        expect(vehicle.fuelType).to.be.a('string');
        expect(vehicle.year).to.be.a('number').and.to.be.within(new Date().getFullYear() - 20, new Date().getFullYear());
        expect(vehicle.mileage).to.be.a('number').and.to.be.within(0, 200000);
        expect(vehicle.price).to.be.a('number').and.to.be.within(1000, 100000);
        expect(vehicle.vin).to.be.a('string');
        expect(vehicle.licensePlate).to.be.a('string');
      });
    });

    it('generates multiple unique vehicles', () => {
      const vehicles = [];
      cy.wrap([1, 2, 3, 4, 5]).each(() => {
        cy.task('generateVehicle').then((vehicle) => {
          vehicles.push(vehicle);
        });
      }).then(() => {
        const uniqueIds = new Set(vehicles.map(v => v.id));
        expect(uniqueIds.size).to.equal(5);
      });
    });
  });

  context('Seed Functionality', () => {
    it('generates identical vehicles with the same seed', () => {
      const seed = 12345;
      cy.task('generateVehicle', { seed }).then((vehicle1) => {
        cy.task('generateVehicle', { seed }).then((vehicle2) => {
          expect(vehicle1).to.deep.equal(vehicle2);
        });
      });
    });

    it('generates different vehicles with different seeds', () => {
      cy.task('generateVehicle', { seed: 12345 }).then((vehicle1) => {
        cy.task('generateVehicle', { seed: 67890 }).then((vehicle2) => {
          expect(vehicle1).to.not.deep.equal(vehicle2);
        });
      });
    });
  });

  context('Locale Support', () => {
    it('generates a vehicle with a specific locale', () => {
      cy.task('generateVehicle', { locale: 'de' }).then((vehicle) => {
        expect(vehicle).to.have.all.keys('id', 'make', 'model', 'type', 'color', 'fuelType', 'year', 'mileage', 'price', 'vin', 'licensePlate');
      });
    });

    it('falls back to default locale for unsupported locale', () => {
      cy.task('generateVehicle', { locale: 'xx' }).then((vehicle) => {
        expect(vehicle).to.have.all.keys('id', 'make', 'model', 'type', 'color', 'fuelType', 'year', 'mileage', 'price', 'vin', 'licensePlate');
      });
    });
  });

  context('Edge Cases', () => {
    it('handles minimum possible values', () => {
      cy.task('generateVehicle', { 
        seed: 'min-values'
      }).then((vehicle) => {
        expect(vehicle.year).to.be.at.least(1886); // First automobile
        expect(vehicle.mileage).to.be.at.least(0);
        expect(vehicle.price).to.be.at.least(1);
      });
    });

    it('handles maximum possible values', () => {
      cy.task('generateVehicle', { 
        seed: 'max-values'
      }).then((vehicle) => {
        expect(vehicle.year).to.be.at.most(new Date().getFullYear() + 1);
        expect(vehicle.mileage).to.be.at.most(1000000);
        expect(vehicle.price).to.be.at.most(10000000);
      });
    });
  });

  context('Negative Cases', () => {
    it('handles invalid seed gracefully', () => {
      cy.task('generateVehicle', { seed: 'invalid-seed' }).then((vehicle) => {
        expect(vehicle).to.have.all.keys('id', 'make', 'model', 'type', 'color', 'fuelType', 'year', 'mileage', 'price', 'vin', 'licensePlate');
      });
    });

    it('handles missing options gracefully', () => {
      cy.task('generateVehicle', null).then((vehicle) => {
        expect(vehicle).to.have.all.keys('id', 'make', 'model', 'type', 'color', 'fuelType', 'year', 'mileage', 'price', 'vin', 'licensePlate');
      });
    });
  });
});
