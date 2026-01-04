const dataGenerator = require('../../src/index');

describe('Data Generator Plugin', () => {
  let generator;

  beforeEach(() => {
    generator = dataGenerator();
  });

  describe('Category data generation', () => {
    it('should generate a category with correct properties', () => {
      const category = generator.generateCategory();
      expect(category).to.have.all.keys('id', 'name', 'description', 'parentId', 'slug', 'isActive');
      expect(category.id).to.be.a('string');
      expect(category.name).to.be.a('string');
      expect(category.description).to.be.a('string');
      expect(category.slug).to.be.a('string');
      expect(category.isActive).to.be.a('boolean');
    });

    it('should generate a category with a specific parent ID', () => {
      const parentId = 'parent123';
      const category = generator.generateCategory({ parentId });
      expect(category.parentId).to.equal(parentId);
    });
  });

  describe('Inventory data generation', () => {
    it('should generate inventory data with correct properties', () => {
      const productId = 'product123';
      const inventory = generator.generateInventory(productId);
      expect(inventory).to.have.all.keys('productId', 'quantity', 'lastUpdated', 'warehouseLocation', 'reorderPoint');
      expect(inventory.productId).to.equal(productId);
      expect(inventory.quantity).to.be.a('number');
      expect(inventory.lastUpdated).to.be.an.instanceOf(Date);
      expect(inventory.warehouseLocation).to.be.a('string');
      expect(inventory.reorderPoint).to.be.a('number');
    });
  });

  describe('Coupon data generation', () => {
    it('should generate a coupon with correct properties', () => {
      const coupon = generator.generateCoupon();
      expect(coupon).to.have.all.keys('code', 'discountType', 'discountValue', 'expirationDate', 'minPurchaseAmount', 'isActive');
      expect(coupon.code).to.be.a('string');
      expect(coupon.discountType).to.be.oneOf(['percentage', 'fixed']);
      expect(coupon.discountValue).to.be.a('number');
      expect(coupon.expirationDate).to.be.an.instanceOf(Date);
      expect(coupon.minPurchaseAmount).to.be.a('number');
      expect(coupon.isActive).to.be.a('boolean');
    });
  });

  describe('Shipping method data generation', () => {
    it('should generate a shipping method with correct properties', () => {
      const shippingMethod = generator.generateShippingMethod();
      expect(shippingMethod).to.have.all.keys('id', 'name', 'price', 'estimatedDeliveryDays', 'provider', 'isAvailable');
      expect(shippingMethod.id).to.be.a('string');
      expect(shippingMethod.name).to.be.oneOf(['Standard', 'Express', 'Overnight', 'Economy', 'Priority']);
      expect(shippingMethod.price).to.be.a('number');
      expect(shippingMethod.estimatedDeliveryDays).to.be.a('number');
      expect(shippingMethod.provider).to.be.a('string');
      expect(shippingMethod.isAvailable).to.be.a('boolean');
    });
  });

  describe('Payment method data generation', () => {
    it('should generate a payment method with correct properties', () => {
      const paymentMethod = generator.generatePaymentMethod();
      expect(paymentMethod).to.have.all.keys('id', 'type', 'name', 'isDefault', 'lastFour', 'expiryDate');
      expect(paymentMethod.id).to.be.a('string');
      expect(paymentMethod.type).to.be.oneOf(['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery', 'Apple Pay', 'Google Pay']);
      expect(paymentMethod.name).to.be.a('string');
      expect(paymentMethod.isDefault).to.be.a('boolean');
      expect(paymentMethod.lastFour).to.be.a('string').and.to.have.lengthOf(4);
      expect(paymentMethod.expiryDate).to.be.an.instanceOf(Date);
    });
  });

  describe('Product with relations data generation', () => {
    it('should generate a product with related products', () => {
      const productWithRelations = generator.generateProductWithRelations({ relatedProductCount: 2 });
      expect(productWithRelations).to.have.property('relatedProducts').that.is.an('array').with.lengthOf(2);
      expect(productWithRelations.relatedProducts[0]).to.have.property('relatedToProductId', productWithRelations.id);
    });
  });

  describe('Bulk data generation', () => {
    it('should generate bulk user data', () => {
      const users = generator.generateBulk(generator.generateUser, 5);
      expect(users).to.be.an('array').with.lengthOf(5);
      users.forEach(user => {
        expect(user).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'age', 'address');
      });
    });

    it('should generate bulk product data', () => {
      const products = generator.generateBulk(generator.generateProduct, 3);
      expect(products).to.be.an('array').with.lengthOf(3);
      products.forEach(product => {
        expect(product).to.have.all.keys('id', 'name', 'description', 'price', 'category', 'inStock', 'image', 'sku', 'relatedProducts');
      });
    });
  });

  describe('Error handling', () => {
    it('should handle invalid age range in user generation', () => {
      const result = generator.generateUser({ ageMin: 30, ageMax: 20 });
      expect(result).to.have.property('error').that.includes('Max 20 should be greater than min 30');
    });

    it('should handle invalid product count in order generation', () => {
      expect(() => generator.generateOrder({ productCount: 0 })).to.throw('Product count must be a positive number');
    });
  });

  describe('Custom options and fields', () => {
    it('should apply custom fields to generated product', () => {
      const customFields = { brand: 'TestBrand', weight: '1kg' };
      const product = generator.generateProduct({ customFields });
      expect(product).to.include(customFields);
    });
  });

  describe('Seed consistency', () => {
    it('should generate consistent data with the same seed', () => {
      const seed = 12345;
      const product1 = generator.generateProduct({ seed });
      const product2 = generator.generateProduct({ seed });
      expect(product1).to.deep.equal(product2);
    });
  });

  describe('Vehicle Data Generation', () => {
    it('generates vehicle data with correct properties', () => {
      cy.task('generateVehicle').then((vehicle) => {
        expect(vehicle).to.have.all.keys('id', 'make', 'model', 'type', 'color', 'fuelType', 'year', 'mileage', 'price', 'vin', 'licensePlate');
        expect(vehicle.id).to.be.a('string');
        expect(vehicle.make).to.be.a('string');
        expect(vehicle.model).to.be.a('string');
        expect(vehicle.type).to.be.a('string');
        expect(vehicle.color).to.be.a('string');
        expect(vehicle.fuelType).to.be.a('string');
        expect(vehicle.year).to.be.a('number');
        expect(vehicle.mileage).to.be.a('number');
        expect(vehicle.price).to.be.a('number');
        expect(vehicle.vin).to.be.a('string');
        expect(vehicle.licensePlate).to.be.a('string');
      });
    });

    it('generates vehicle data with a specific locale', () => {
      cy.task('generateVehicle', { locale: 'de' }).then((vehicle) => {
        expect(vehicle.make).to.be.a('string');
      });
    });

    it('generates consistent vehicle data with the same seed', () => {
      const seed = 12345;
      cy.task('generateVehicle', { seed }).then((vehicle1) => {
        cy.task('generateVehicle', { seed }).then((vehicle2) => {
          expect(vehicle1).to.deep.equal(vehicle2);
        });
      });
    });
  });

  describe('Education Data Generation', () => {
    it('generates education data with correct properties', () => {
      cy.task('generateEducation').then((education) => {
        expect(education).to.have.all.keys('id', 'degree', 'fieldOfStudy', 'university', 'graduationYear', 'gpa', 'honors', 'activities', 'startDate', 'endDate');
        expect(education.id).to.be.a('string');
        expect(education.degree).to.be.a('string');
        expect(education.fieldOfStudy).to.be.a('string');
        expect(education.university).to.be.a('string');
        expect(education.graduationYear).to.be.a('number');
        expect(education.gpa).to.be.a('number');
        expect(education.honors).to.satisfy((value) => value === null || typeof value === 'string');
        expect(education.activities).to.be.an('array');
        expect(education.startDate).to.be.a('string');
        expect(education.endDate).to.be.a('string');
      });
    });

    it('generates education data with a specific locale', () => {
      cy.task('generateEducation', { locale: 'de' }).then((education) => {
        expect(education.university).to.be.a('string');
      });
    });

    it('generates consistent education data with the same seed', () => {
      const seed = 12345;
      cy.task('generateEducation', { seed }).then((education1) => {
        cy.task('generateEducation', { seed }).then((education2) => {
          expect(education1).to.deep.equal(education2);
        });
      });
    });
  });

  describe('Company Data Generation', () => {
    it('generates company data with correct properties', () => {
      cy.task('generateCompany').then((company) => {
        expect(company).to.have.all.keys('id', 'name', 'industry', 'foundedYear', 'employees', 'revenue', 'headquarters', 'ceo', 'description', 'stockSymbol', 'website');
        expect(company.id).to.be.a('string');
        expect(company.name).to.be.a('string');
        expect(company.industry).to.be.a('string');
        expect(company.foundedYear).to.be.a('number');
        expect(company.employees).to.be.a('number');
        expect(company.revenue).to.be.a('string');
        expect(company.headquarters).to.be.a('string');
        expect(company.ceo).to.be.a('string');
        expect(company.description).to.be.a('string');
        expect(company.stockSymbol).to.be.a('string');
        expect(company.website).to.be.a('string');
      });
    });

    it('generates company data with a specific locale', () => {
      cy.task('generateCompany', { locale: 'de' }).then((company) => {
        expect(company.name).to.be.a('string');
      });
    });

    it('generates consistent company data with the same seed', () => {
      const seed = 12345;
      cy.task('generateCompany', { seed }).then((company1) => {
        cy.task('generateCompany', { seed }).then((company2) => {
          expect(company1).to.deep.equal(company2);
        });
      });
    });
  });

  describe('Medical Record Data Generation', () => {
    it('generates medical record data with correct properties', () => {
      cy.task('generateMedicalRecord').then((record) => {
        expect(record).to.have.all.keys('patientId', 'name', 'dateOfBirth', 'gender', 'bloodType', 'height', 'weight', 'allergies', 'medications', 'diagnoses', 'treatmentHistory', 'upcomingAppointments', 'primaryCarePhysician');
        expect(record.patientId).to.be.a('string');
        expect(record.name).to.be.a('string');
        expect(record.dateOfBirth).to.be.a('string');
        expect(record.gender).to.be.a('string');
        expect(record.bloodType).to.be.a('string');
        expect(record.height).to.be.a('number');
        expect(record.weight).to.be.a('number');
        expect(record.allergies).to.be.an('array');
        expect(record.medications).to.be.an('array');
        expect(record.diagnoses).to.be.an('array');
        expect(record.treatmentHistory).to.be.a('string');
        expect(record.upcomingAppointments).to.be.a('string');
        expect(record.primaryCarePhysician).to.be.a('string');
      });
    });

    it('generates medical record data with a specific locale', () => {
      cy.task('generateMedicalRecord', { locale: 'de' }).then((record) => {
        expect(record.name).to.be.a('string');
      });
    });

    it('generates consistent medical record data with the same seed', () => {
      const seed = 12345;
      cy.task('generateMedicalRecord', { seed }).then((record1) => {
        cy.task('generateMedicalRecord', { seed }).then((record2) => {
          expect(record1).to.deep.equal(record2);
        });
      });
    });
  });

  describe('Travel Itinerary Data Generation', () => {
    it('generates travel itinerary data with correct properties', () => {
      cy.task('generateTravelItinerary').then((itinerary) => {
        expect(itinerary).to.have.all.keys('travelerName', 'destination', 'departureDate', 'returnDate', 'flightDetails', 'hotelReservation', 'carRental', 'plannedActivities', 'travelInsurance', 'passportNumber', 'emergencyContact');
        expect(itinerary.travelerName).to.be.a('string');
        expect(itinerary.destination).to.be.a('string');
        expect(itinerary.departureDate).to.be.a('string');
        expect(itinerary.returnDate).to.be.a('string');
        expect(itinerary.flightDetails).to.be.an('object').and.to.have.all.keys('airline', 'flightNumber', 'departureTime', 'arrivalTime');
        expect(itinerary.hotelReservation).to.be.an('object').and.to.have.all.keys('hotelName', 'checkIn', 'checkOut', 'roomType');
        expect(itinerary.carRental).to.be.an('object').and.to.have.all.keys('company', 'carModel', 'pickupLocation');
        expect(itinerary.plannedActivities).to.be.an('array').and.to.have.length(3);
        expect(itinerary.travelInsurance).to.be.an('object').and.to.have.all.keys('provider', 'policyNumber');
        expect(itinerary.passportNumber).to.be.a('string');
        expect(itinerary.emergencyContact).to.be.an('object').and.to.have.all.keys('name', 'phone', 'relationship');
      });
    });

    it('generates travel itinerary data with a specific locale', () => {
      cy.task('generateTravelItinerary', { locale: 'de' }).then((itinerary) => {
        expect(itinerary.destination).to.be.a('string');
      });
    });

    it('generates consistent travel itinerary data with the same seed', () => {
      const seed = 12345;
      cy.task('generateTravelItinerary', { seed }).then((itinerary1) => {
        cy.task('generateTravelItinerary', { seed }).then((itinerary2) => {
          expect(itinerary1).to.deep.equal(itinerary2);
        });
      });
    });
  });
});
