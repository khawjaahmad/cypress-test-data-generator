const createUserGenerators = require('./user');
const createEcommerceGenerators = require('./ecommerce');
const createSocialGenerators = require('./social');
const createBusinessGenerators = require('./business');
const createFinanceGenerators = require('./finance');
const createContentGenerators = require('./content');
const createTravelGenerators = require('./travel');
const createRealEstateGenerators = require('./realestate');
const createFoodGenerators = require('./food');
const createTechnicalGenerators = require('./technical');
const createHealthcareGenerators = require('./healthcare');

module.exports = {
    createUserGenerators,
    createEcommerceGenerators,
    createSocialGenerators,
    createBusinessGenerators,
    createFinanceGenerators,
    createContentGenerators,
    createTravelGenerators,
    createRealEstateGenerators,
    createFoodGenerators,
    createTechnicalGenerators,
    createHealthcareGenerators
};
