import {
  expectValidRestaurant,
  expectValidMenuItem,
  expectValidFoodOrder
} from '../support/schemas';

describe('Food & Restaurant Generators', () => {
  describe('Restaurant Generator', () => {
    context('Basic Generation', () => {
      it('generates valid restaurant with default options', () => {
        cy.task('generateRestaurant').then(expectValidRestaurant);
      });

      it('generates restaurant with valid address structure', () => {
        cy.task('generateRestaurant').then((restaurant) => {
          expect(restaurant.address).to.have.all.keys('street', 'city', 'state', 'zipCode', 'country');
          expect(restaurant.address.street).to.be.a('string');
          expect(restaurant.address.city).to.be.a('string');
        });
      });

      it('generates restaurant with valid hours structure', () => {
        cy.task('generateRestaurant').then((restaurant) => {
          expect(restaurant.hours).to.have.all.keys(
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
          );
          Object.values(restaurant.hours).forEach((dayHours) => {
            expect(dayHours).to.have.all.keys('open', 'close');
          });
        });
      });

      it('generates restaurant with valid features', () => {
        cy.task('generateRestaurant').then((restaurant) => {
          expect(restaurant.features).to.be.an('array');
          const validFeatures = [
            'Outdoor Seating', 'Takeout', 'Delivery', 'Reservations',
            'Wifi', 'Parking', 'Wheelchair Accessible', 'Live Music',
            'Happy Hour', 'Private Dining', 'Bar', 'Kids Menu'
          ];
          restaurant.features.forEach((feature) => {
            expect(feature).to.be.oneOf(validFeatures);
          });
        });
      });

      it('generates restaurant with boolean flags', () => {
        cy.task('generateRestaurant').then((restaurant) => {
          expect(restaurant.isOpen).to.be.a('boolean');
          expect(restaurant.acceptsReservations).to.be.a('boolean');
        });
      });

      it('generates restaurant with valid coordinates', () => {
        cy.task('generateRestaurant').then((restaurant) => {
          expect(restaurant.coordinates).to.have.all.keys('latitude', 'longitude');
          expect(restaurant.coordinates.latitude).to.be.a('number');
          expect(restaurant.coordinates.longitude).to.be.a('number');
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates restaurants with same core data using same seed', () => {
        const seed = 54321;
        cy.task('generateRestaurant', { seed }).then((r1) => {
          cy.task('generateRestaurant', { seed }).then((r2) => {
            expect(r1.id).to.equal(r2.id);
            expect(r1.name).to.equal(r2.name);
            expect(r1.priceRange).to.equal(r2.priceRange);
          });
        });
      });
    });
  });

  describe('Menu Item Generator', () => {
    context('Basic Generation', () => {
      it('generates valid menu item with default options', () => {
        cy.task('generateMenuItem').then(expectValidMenuItem);
      });

      it('generates menu item with valid nutritional info', () => {
        cy.task('generateMenuItem').then((item) => {
          expect(item.calories).to.be.a('number').and.to.be.at.least(100);
          expect(item.spicyLevel).to.be.a('number').and.to.be.within(0, 5);
        });
      });

      it('generates menu item with allergens array', () => {
        cy.task('generateMenuItem').then((item) => {
          expect(item.allergens).to.be.an('array');
          const validAllergens = ['Nuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Fish', 'Shellfish'];
          item.allergens.forEach((allergen) => {
            expect(allergen).to.be.oneOf(validAllergens);
          });
        });
      });

      it('generates menu item with ingredients array', () => {
        cy.task('generateMenuItem').then((item) => {
          expect(item.ingredients).to.be.an('array').and.to.have.length.at.least(3);
          item.ingredients.forEach((ingredient) => {
            expect(ingredient).to.be.a('string');
          });
        });
      });

      it('generates menu item with dietary flags', () => {
        cy.task('generateMenuItem').then((item) => {
          expect(item.isAvailable).to.be.a('boolean');
          expect(item.isPopular).to.be.a('boolean');
          expect(item.isNewItem).to.be.a('boolean');
        });
      });

      it('generates menu item with valid preparation time', () => {
        cy.task('generateMenuItem').then((item) => {
          expect(item.preparationTime).to.be.a('number').and.to.be.within(5, 45);
        });
      });

      it('generates menu item with nutrition info', () => {
        cy.task('generateMenuItem').then((item) => {
          expect(item.nutritionInfo).to.have.all.keys('protein', 'carbs', 'fat', 'fiber', 'sodium');
          expect(item.nutritionInfo.protein).to.be.a('number');
          expect(item.nutritionInfo.carbs).to.be.a('number');
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates menu items with same core data using same seed', () => {
        const seed = 99999;
        cy.task('generateMenuItem', { seed }).then((item1) => {
          cy.task('generateMenuItem', { seed }).then((item2) => {
            expect(item1.id).to.equal(item2.id);
            expect(item1.name).to.equal(item2.name);
            expect(item1.category).to.equal(item2.category);
          });
        });
      });
    });
  });

  describe('Food Order Generator', () => {
    context('Basic Generation', () => {
      it('generates valid food order with default options', () => {
        cy.task('generateFoodOrder').then(expectValidFoodOrder);
      });

      it('generates food order with valid customer structure', () => {
        cy.task('generateFoodOrder').then((order) => {
          expect(order.customer).to.have.all.keys('id', 'name', 'phone', 'email');
          expect(order.customer.id).to.be.a('string');
          expect(order.customer.name).to.be.a('string');
        });
      });

      it('generates food order with valid restaurant structure', () => {
        cy.task('generateFoodOrder').then((order) => {
          expect(order.restaurant).to.have.all.keys('id', 'name', 'address', 'phone');
          expect(order.restaurant.id).to.be.a('string');
          expect(order.restaurant.name).to.be.a('string');
        });
      });

      it('generates food order with valid items array', () => {
        cy.task('generateFoodOrder').then((order) => {
          expect(order.items).to.be.an('array').and.to.have.length.at.least(1);
          order.items.forEach((item) => {
            expect(item).to.have.all.keys('id', 'name', 'price', 'quantity', 'subtotal', 'specialInstructions', 'customizations');
            expect(item.subtotal).to.equal(parseFloat((item.price * item.quantity).toFixed(2)));
          });
        });
      });

      it('generates food order with valid payment info', () => {
        cy.task('generateFoodOrder').then((order) => {
          expect(order.paymentMethod).to.be.oneOf(['credit_card', 'debit_card', 'cash', 'apple_pay', 'google_pay']);
          expect(order.isPaid).to.be.a('boolean');
        });
      });

      it('generates food order with correct total calculation', () => {
        cy.task('generateFoodOrder').then((order) => {
          const calculatedTotal = order.subtotal + order.deliveryFee + order.tax + order.tip;
          expect(order.total).to.be.closeTo(calculatedTotal, 0.01);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates food orders with same core data using same seed', () => {
        const seed = 77777;
        cy.task('generateFoodOrder', { seed }).then((order1) => {
          cy.task('generateFoodOrder', { seed }).then((order2) => {
            expect(order1.id).to.equal(order2.id);
            expect(order1.orderNumber).to.equal(order2.orderNumber);
            expect(order1.customer.name).to.equal(order2.customer.name);
          });
        });
      });
    });
  });
});
