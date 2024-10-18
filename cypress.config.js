const { defineConfig } = require('cypress');
const dataGenerator = require('./src/index');

module.exports = defineConfig({
  e2e: {
    experimentalRunAllSpecs:true,
    setupNodeEvents(on, config) {
      // Initialize the data generator
      const generator = dataGenerator(on, config);

      // Register custom commands
      on('task', {
        generateUser(options) {
          return generator.generateUser(options);
        },
        generateProduct(options) {
          return generator.generateProduct(options);
        },
        generateOrder(options) {
          return generator.generateOrder(options);
        },
        generateReview(options) {
          return generator.generateReview(options);
        },
        generateCategory(options) {
          return generator.generateCategory(options);
        },
        generateInventory(productId, options) {
          return generator.generateInventory(productId, options);
        },
        generateCoupon(options) {
          return generator.generateCoupon(options);
        },
        generateShippingMethod(options) {
          return generator.generateShippingMethod(options);
        },
        generatePaymentMethod(options) {
          return generator.generatePaymentMethod(options);
        },
        generateProductWithRelations(options) {
          return generator.generateProductWithRelations(options);
        },
        generateVehicle(options) {
          return generator.generateVehicle(options);
        },
        generateJobListing(options) {
          return generator.generateJobListing(options);
        },
        generateEducation(options) {
          return generator.generateEducation(options);
        },
        generateCompany(options) {
          return generator.generateCompany(options);
        },
        generateMedicalRecord(options) {
          return generator.generateMedicalRecord(options);
        },
        generateTravelItinerary(options) {
          return generator.generateTravelItinerary(options);
        },
      });
    },
  },
});
