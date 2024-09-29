# Cypress Test Data Generator Plugin

This plugin provides powerful functionalities to generate random test data for users, products, orders, reviews, and categories in your Cypress tests. It leverages Faker.js to create realistic and diverse test data, enhancing the robustness of your Cypress test suites.

## Features

- Generate random user data with customizable age ranges and countries
- Create product data with various attributes like name, price, and stock status
- Generate complex order data with multiple products
- Create realistic product reviews with ratings and comments
- Generate category data for product classification
- Supports localization for multi-language testing scenarios
- Provides consistent data generation with seed support

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

## API

### `generateUser(options)`

Generates a random user object.

- **Options:**
  - `ageRange`: An object specifying the minimum and maximum age (default: `{ min: 18, max: 99 }`)
  - `country`: Country (default: random)
  - `seed`: Number to seed the random generator for consistent results
  - `locale`: Locale for localized data generation

### `generateProduct(options)`

Generates a random product object.

- **Options:**
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation
  - `customFields`: Object with additional fields to include

### `generateOrder(options)`

Generates a random order object.

- **Options:**
  - `productCount`: Number of products in the order (default: `3`)
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateReview(options)`

Generates a random review object.

- **Options:**
  - `productId`: Specific product ID for the review
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

### `generateCategory(options)`

Generates a random category object.

- **Options:**
  - `parentId`: ID of the parent category for generating subcategories
  - `seed`: Number to seed the random generator
  - `locale`: Locale for localized data generation

## Error Handling

The plugin includes robust error handling for invalid inputs. If provided options are invalid (e.g., invalid age range), the plugin will throw descriptive errors to aid in debugging.

## Example Tests

For detailed usage examples, please refer to our [example tests](https://github.com/khawjaahmad/cypress-test-data-generator/tree/main/cypress/e2e) in the `cypress/e2e` directory. These tests demonstrate various ways to use the data generator:

- `e2e-plugin.cy.js`: Demonstrates basic usage of the plugin
- `review.cy.js`: Shows how to generate review data
- `product.cy.js`: Illustrates product data generation
- `order.cy.js`: Examples of order data generation
- `user.cy.js`: Demonstrates user data generation

Each file contains multiple test cases that showcase different aspects and options of the data generator. These example tests serve as both verification of the plugin's functionality and as practical examples for users.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.