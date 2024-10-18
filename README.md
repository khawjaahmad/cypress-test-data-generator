# Cypress Test Data Generator Plugin

Generate realistic and diverse test data for Cypress tests using Faker.js. This plugin enhances your test suites with random data for various entities.

## Features

- Generate data for:
  - Users (with customizable age ranges and countries)
  - Products (including name, price, stock status)
  - Orders (with multiple products)
  - Reviews (with ratings and comments)
  - Categories
  - Companies (including industry, revenue, employees)
  - Medical records
  - Travel itineraries
  - Education records
  - Job listings
  - Vehicles
- Support for localization
- Consistent data generation with seed support

## Installation

1. Install the plugin as a dev dependency:
   ```bash
   npm install --save-dev cypress-test-data-generator
   ```

2. Include the plugin in your Cypress configuration (usually in `cypress.config.js`):
   ```javascript
   const dataGenerator = require('cypress-test-data-generator');

   module.exports = defineConfig({
     e2e: {
       setupNodeEvents(on, config) {
         on('task', dataGenerator(on, config));
       },
     },
   });
   ```

## Usage

### Generating a User

```javascript
cy.task('generateUser', { ageRange: { min: 20, max: 30 }, country: 'USA' }).then((user) => {
  cy.log(`Generated User: ${JSON.stringify(user)}`);
});
```

### Generating a Product

```javascript
cy.task('generateProduct').then((product) => {
  cy.log(`Generated Product: ${JSON.stringify(product)}`);
});
```

### Generating an Order

```javascript
cy.task('generateOrder', { productCount: 5 }).then((order) => {
  cy.log(`Generated Order: ${JSON.stringify(order)}`);
});
```

### Generating a Review

```javascript
cy.task('generateReview').then((review) => {
  cy.log(`Generated Review: ${JSON.stringify(review)}`);
});
```

### Generating a Category

```javascript
cy.task('generateCategory').then((category) => {
  cy.log(`Generated Category: ${JSON.stringify(category)}`);
});
```

### Generating a Company

```javascript
cy.task('generateCompany').then((company) => {
  cy.log(`Generated Company: ${JSON.stringify(company)}`);
});
```

### Generating a Medical Record

```javascript
cy.task('generateMedicalRecord').then((record) => {
  cy.log(`Generated Medical Record: ${JSON.stringify(record)}`);
});
```

### Generating a Travel Itinerary

```javascript
cy.task('generateTravelItinerary').then((itinerary) => {
  cy.log(`Generated Travel Itinerary: ${JSON.stringify(itinerary)}`);
});
```

### Generating Education Data

```javascript
cy.task('generateEducation').then((education) => {
  cy.log(`Generated Education: ${JSON.stringify(education)}`);
});
```

### Generating a Job Listing

```javascript
cy.task('generateJobListing').then((jobListing) => {
  cy.log(`Generated Job Listing: ${JSON.stringify(jobListing)}`);
});
```

### Generating Vehicle Data

```javascript
cy.task('generateVehicle').then((vehicle) => {
  cy.log(`Generated Vehicle: ${JSON.stringify(vehicle)}`);
});
```

## API

### `generateUser(options)`

Generates a random user object.

- **Options:**
  - `seed`: Number to seed the random generator for consistent results
  - `locale`: Locale for localized data generation
  - `ageRange`: An object specifying the minimum and maximum age (default: `{ min: 18, max: 99 }`)
  - `country`: Specific country for the user's address (default: random)
  - `ageMin`: Minimum age (default: 18)
  - `ageMax`: Maximum age (default: 99)

### `generateProduct(options)`

Generates a random product object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation
  - `customFields`: Object with additional fields to include
  - `relatedProducts`: Array of related product objects

### `generateOrder(options)`

Generates a random order object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation
  - `productCount`: Number of products in the order (default: 3)

### `generateReview(options)`

Generates a random review object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation
  - `productId`: Specific product ID for the review

### `generateCategory(options)`

Generates a random category object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation
  - `parentId`: ID of the parent category (default: null)

### `generateInventory(productId, options)`

Generates a random inventory object for a product.

- **Parameters:**
  - `productId`: ID of the product
- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateCoupon(options)`

Generates a random coupon object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateShippingMethod(options)`

Generates a random shipping method object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generatePaymentMethod(options)`

Generates a random payment method object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateRelatedProducts(mainProductId, count, options)`

Generates an array of related product objects.

- **Parameters:**
  - `mainProductId`: ID of the main product
  - `count`: Number of related products to generate (default: 3)
- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateProductWithRelations(options)`

Generates a product object with related products.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation
  - `relatedProductCount`: Number of related products to generate (default: 3)

### `generateJobListing(options)`

Generates a random job listing object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateEducation(options)`

Generates a random education object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateCompany(options)`

Generates a random company object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateMedicalRecord(options)`

Generates a random medical record object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateTravelItinerary(options)`

Generates a random travel itinerary object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateVehicle(options)`

Generates a random vehicle object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

## Error Handling

The plugin includes robust error handling for invalid inputs. If provided options are invalid (e.g., invalid age range), the plugin will throw descriptive errors to aid in debugging.

## Example Tests

For detailed usage examples, refer to our [example tests](https://github.com/khawjaahmad/cypress-test-data-generator/tree/main/cypress/e2e) in the `cypress/e2e` directory. These tests cover:

- Basic plugin usage
- Data generation for users, products, orders, reviews, companies, medical records, travel itineraries, education, job listings, and vehicles

Each file demonstrates various aspects and options of the data generator, serving as both functional verification and practical examples for users.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
