# Cypress Test Data Generator

Generate realistic test data for Cypress tests using Faker.js. This plugin provides 40+ generators covering users, e-commerce, social, business, finance, and more.

## Features

- **40+ Data Generators** across multiple domains
- **Seed Support** for reproducible test data
- **Locale Support** for internationalization
- **Modular Architecture** with domain-specific generators
- **TypeScript-friendly** with consistent APIs

## Installation

```bash
npm install --save-dev cypress-test-data-generator
```

## Setup

Add the plugin to your `cypress.config.js`:

```javascript
const { defineConfig } = require('cypress');
const dataGenerator = require('cypress-test-data-generator');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', dataGenerator(on, config));
    },
  },
});
```

## Quick Start

```javascript
// Generate a user
cy.task('generateUser').then((user) => {
  // { id, firstName, lastName, email, phone, avatar, dateOfBirth, gender, address, preferences }
});

// Generate with options
cy.task('generateUser', {
  seed: 12345,           // Reproducible data
  locale: 'de',          // German locale
  ageMin: 25,
  ageMax: 35
});
```

## Available Generators

### User & Profile
| Generator | Description |
|-----------|-------------|
| `generateUser` | User with profile, address, preferences |
| `generateAddress` | Standalone address with coordinates |

### E-commerce
| Generator | Description |
|-----------|-------------|
| `generateProduct` | Product with SKU, pricing, stock |
| `generateProductWithRelations` | Product with related products |
| `generateOrder` | Order with products, shipping |
| `generateReview` | Product review with rating |
| `generateCategory` | Product category with hierarchy |
| `generateCart` | Shopping cart with items |
| `generateWishlist` | User wishlist |
| `generateReturn` | Return/refund request |
| `generateInventory` | Product inventory |
| `generateCoupon` | Discount coupon |
| `generateShippingMethod` | Shipping option |
| `generatePaymentMethod` | Payment method |

### Social & Communication
| Generator | Description |
|-----------|-------------|
| `generateSocialProfile` | Social media profile |
| `generateComment` | Comment with replies |
| `generateNotification` | App notification |
| `generateMessage` | Chat/direct message |

### Business & Enterprise
| Generator | Description |
|-----------|-------------|
| `generateCompany` | Company with industry, revenue |
| `generateInvoice` | Invoice with line items |
| `generateEmployee` | Employee with department, salary |
| `generateProject` | Project with team, milestones |
| `generateTicket` | Support ticket |
| `generateMeeting` | Meeting with attendees |
| `generateJobListing` | Job posting |

### Finance
| Generator | Description |
|-----------|-------------|
| `generateBankAccount` | Bank account with balance |
| `generateLoan` | Loan with terms |
| `generateInsurancePolicy` | Insurance policy |
| `generateCreditCard` | Credit card details |
| `generateTransaction` | Financial transaction |
| `generateSubscription` | Subscription plan |

### Content & Media
| Generator | Description |
|-----------|-------------|
| `generateBlogPost` | Blog post with SEO |
| `generateEvent` | Event with tickets, speakers |

### Travel & Automotive
| Generator | Description |
|-----------|-------------|
| `generateTravelItinerary` | Travel plan with flights, hotels |
| `generateVehicle` | Vehicle with specs |

### Real Estate
| Generator | Description |
|-----------|-------------|
| `generateProperty` | Property listing |

### Food & Restaurant
| Generator | Description |
|-----------|-------------|
| `generateRestaurant` | Restaurant with hours, features |
| `generateMenuItem` | Menu item with nutrition |
| `generateFoodOrder` | Food delivery order |

### Technical & API
| Generator | Description |
|-----------|-------------|
| `generateApiResponse` | API response with pagination |
| `generateLogEntry` | Application log entry |

### Healthcare & Education
| Generator | Description |
|-----------|-------------|
| `generateMedicalRecord` | Medical record |
| `generateEducation` | Education record |

## Usage Examples

### E-commerce Flow
```javascript
// Create product catalog
cy.task('generateProduct').then((product) => {
  cy.task('generateReview', { productId: product.id }).then((review) => {
    // Test product with review
  });
});

// Generate order with multiple products
cy.task('generateOrder', { productCount: 5 }).then((order) => {
  expect(order.products).to.have.length(5);
  expect(order.totalAmount).to.be.a('number');
});

// Shopping cart
cy.task('generateCart', { itemCount: 3 }).then((cart) => {
  expect(cart.items).to.have.length(3);
  expect(cart.total).to.equal(cart.subtotal + cart.tax - cart.discount);
});
```

### Business Operations
```javascript
// Generate invoice
cy.task('generateInvoice', { itemCount: 5 }).then((invoice) => {
  expect(invoice.invoiceNumber).to.match(/^INV-\d{6}$/);
  expect(invoice.status).to.be.oneOf(['draft', 'sent', 'paid', 'overdue']);
});

// Generate employee
cy.task('generateEmployee', { department: 'Engineering' }).then((employee) => {
  expect(employee.department).to.equal('Engineering');
  expect(employee.employeeId).to.match(/^EMP-\d{6}$/);
});
```

### Social Features
```javascript
// Social profile for specific platform
cy.task('generateSocialProfile', { platform: 'instagram' }).then((profile) => {
  expect(profile.platform).to.equal('instagram');
  expect(profile.followers).to.be.a('number');
});

// Generate notification
cy.task('generateNotification', { type: 'payment' }).then((notification) => {
  expect(notification.type).to.equal('payment');
  expect(notification.priority).to.be.oneOf(['low', 'medium', 'high', 'urgent']);
});
```

### Financial Data
```javascript
// Bank account
cy.task('generateBankAccount').then((account) => {
  expect(account.accountType).to.be.oneOf(['checking', 'savings', 'money_market']);
  expect(account.balance).to.be.a('number');
});

// Loan
cy.task('generateLoan', { type: 'mortgage' }).then((loan) => {
  expect(loan.type).to.equal('mortgage');
  expect(loan.loanNumber).to.match(/^LN-\d{10}$/);
});
```

## Common Options

All generators support these options:

| Option | Type | Description |
|--------|------|-------------|
| `seed` | `number` | Seed for reproducible data |
| `locale` | `string` | Locale code (e.g., 'en', 'de', 'fr') |

### Seed Example
```javascript
const seed = 12345;

cy.task('generateUser', { seed }).then((user1) => {
  cy.task('generateUser', { seed }).then((user2) => {
    // user1 and user2 are identical
    expect(user1.firstName).to.equal(user2.firstName);
  });
});
```

### Locale Example
```javascript
cy.task('generateUser', { locale: 'de' }).then((user) => {
  // German names and addresses
});
```

## Schema Validators

The plugin includes centralized schema validators for testing:

```javascript
import { expectValidUser, expectValidProduct } from '../support/schemas';

it('generates valid user', () => {
  cy.task('generateUser').then(expectValidUser);
});

it('generates valid product', () => {
  cy.task('generateProduct').then(expectValidProduct);
});
```

## Error Handling

Invalid options return descriptive errors:

```javascript
cy.task('generateUser', { ageMin: 50, ageMax: 30 }).then((result) => {
  // { error: 'Max 30 should be greater than min 50' }
});
```

## Requirements

- Cypress 13.0.0+
- Node.js 18+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.
