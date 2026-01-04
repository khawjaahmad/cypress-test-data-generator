const { defineConfig } = require('cypress');
const dataGenerator = require('./src/index');

module.exports = defineConfig({
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      // Initialize the data generator
      const generator = dataGenerator(on, config);

      // Register all data generation tasks
      on('task', {
        // ============================================
        // USER & PROFILE
        // ============================================
        generateUser(options) {
          return generator.generateUser(options);
        },
        generateAddress(options) {
          return generator.generateAddress(options);
        },

        // ============================================
        // E-COMMERCE
        // ============================================
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
        generateInventory({ productId, options }) {
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
        generateCart(options) {
          return generator.generateCart(options);
        },
        generateWishlist(options) {
          return generator.generateWishlist(options);
        },
        generateReturn(options) {
          return generator.generateReturn(options);
        },

        // ============================================
        // SOCIAL & COMMUNICATION
        // ============================================
        generateSocialProfile(options) {
          return generator.generateSocialProfile(options);
        },
        generateComment(options) {
          return generator.generateComment(options);
        },
        generateNotification(options) {
          return generator.generateNotification(options);
        },
        generateMessage(options) {
          return generator.generateMessage(options);
        },

        // ============================================
        // BUSINESS & ENTERPRISE
        // ============================================
        generateCompany(options) {
          return generator.generateCompany(options);
        },
        generateInvoice(options) {
          return generator.generateInvoice(options);
        },
        generateEmployee(options) {
          return generator.generateEmployee(options);
        },
        generateProject(options) {
          return generator.generateProject(options);
        },
        generateTicket(options) {
          return generator.generateTicket(options);
        },
        generateMeeting(options) {
          return generator.generateMeeting(options);
        },
        generateJobListing(options) {
          return generator.generateJobListing(options);
        },

        // ============================================
        // FINANCE
        // ============================================
        generateCreditCard(options) {
          return generator.generateCreditCard(options);
        },
        generateTransaction(options) {
          return generator.generateTransaction(options);
        },
        generateBankAccount(options) {
          return generator.generateBankAccount(options);
        },
        generateLoan(options) {
          return generator.generateLoan(options);
        },
        generateInsurancePolicy(options) {
          return generator.generateInsurancePolicy(options);
        },
        generateSubscription(options) {
          return generator.generateSubscription(options);
        },

        // ============================================
        // CONTENT & MEDIA
        // ============================================
        generateBlogPost(options) {
          return generator.generateBlogPost(options);
        },
        generateEvent(options) {
          return generator.generateEvent(options);
        },

        // ============================================
        // TRAVEL & AUTOMOTIVE
        // ============================================
        generateTravelItinerary(options) {
          return generator.generateTravelItinerary(options);
        },
        generateVehicle(options) {
          return generator.generateVehicle(options);
        },

        // ============================================
        // REAL ESTATE
        // ============================================
        generateProperty(options) {
          return generator.generateProperty(options);
        },

        // ============================================
        // FOOD & RESTAURANT
        // ============================================
        generateRestaurant(options) {
          return generator.generateRestaurant(options);
        },
        generateMenuItem(options) {
          return generator.generateMenuItem(options);
        },
        generateFoodOrder(options) {
          return generator.generateFoodOrder(options);
        },

        // ============================================
        // TECHNICAL & API
        // ============================================
        generateApiResponse(options) {
          return generator.generateApiResponse(options);
        },
        generateLogEntry(options) {
          return generator.generateLogEntry(options);
        },

        // ============================================
        // HEALTHCARE & EDUCATION
        // ============================================
        generateMedicalRecord(options) {
          return generator.generateMedicalRecord(options);
        },
        generateEducation(options) {
          return generator.generateEducation(options);
        },

        // ============================================
        // UTILITY
        // ============================================
        generateBulk({ generator: generatorName, count, options }) {
          return generator.generateBulk(generatorName, count, options);
        },
      });

      return config;
    },
  },
});
