<div align="center">

# Cypress Test Data Generator

**Generate realistic, reproducible test data for Cypress tests**

[![npm version](https://img.shields.io/npm/v/cypress-test-data-generator.svg?style=flat-square)](https://www.npmjs.com/package/cypress-test-data-generator)
[![npm downloads](https://img.shields.io/npm/dm/cypress-test-data-generator.svg?style=flat-square)](https://www.npmjs.com/package/cypress-test-data-generator)
[![license](https://img.shields.io/npm/l/cypress-test-data-generator.svg?style=flat-square)](https://github.com/khawjaahmad/cypress-test-data-generator/blob/main/LICENSE)

[Installation](#installation) •
[Quick Start](#quick-start) •
[Generators](#available-generators) •
[Examples](#usage-examples) •
[API](#common-options) •
[Contributing](#contributing)

</div>

---

## Why This Plugin?

Writing realistic test data by hand is tedious and error-prone. This plugin provides **40+ data generators** powered by [Faker.js](https://fakerjs.dev/) that create consistent, realistic data for your Cypress tests.

```javascript
// Before: Manual test data
const user = { name: 'Test User', email: 'test@test.com', age: 25 };

// After: Rich, realistic data
cy.task('generateUser').then((user) => {
  // { id, firstName, lastName, email, phone, avatar, dateOfBirth, address, preferences, ... }
});
```

### Key Features

- **40+ Generators** — Users, products, orders, invoices, social profiles, and more
- **Reproducible Data** — Seed support for consistent test runs
- **Internationalization** — 50+ locales for localized data
- **Zero Config** — Works out of the box with sensible defaults
- **Fully Typed** — Consistent API across all generators

---

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

---

## Quick Start

```javascript
// Generate a single user
cy.task('generateUser').then((user) => {
  cy.visit('/register');
  cy.get('#email').type(user.email);
  cy.get('#name').type(`${user.firstName} ${user.lastName}`);
});

// Generate with options
cy.task('generateUser', {
  seed: 12345,    // Same seed = same data
  locale: 'de'    // German names/addresses
});

// Generate related data
cy.task('generateProduct').then((product) => {
  cy.task('generateReview', { productId: product.id }).then((review) => {
    // Test product with its review
  });
});
```

---

## Available Generators

<details>
<summary><strong>User & Profile</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateUser` | Complete user profile with address and preferences |
| `generateAddress` | Standalone address with coordinates |

</details>

<details>
<summary><strong>E-commerce</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateProduct` | Product with SKU, pricing, stock status |
| `generateProductWithRelations` | Product with related products |
| `generateOrder` | Order with products and shipping |
| `generateReview` | Product review with rating |
| `generateCategory` | Category with hierarchy support |
| `generateCart` | Shopping cart with items |
| `generateWishlist` | User wishlist |
| `generateReturn` | Return/refund request |
| `generateInventory` | Product inventory |
| `generateCoupon` | Discount coupon |
| `generateShippingMethod` | Shipping option |
| `generatePaymentMethod` | Payment method |

</details>

<details>
<summary><strong>Social & Communication</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateSocialProfile` | Social media profile (Twitter, Instagram, etc.) |
| `generateComment` | Comment with replies support |
| `generateNotification` | App notification |
| `generateMessage` | Chat/direct message |

</details>

<details>
<summary><strong>Business & Enterprise</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateCompany` | Company with industry and revenue |
| `generateInvoice` | Invoice with line items |
| `generateEmployee` | Employee with department and salary |
| `generateProject` | Project with team and milestones |
| `generateTicket` | Support ticket |
| `generateMeeting` | Meeting with attendees |
| `generateJobListing` | Job posting |

</details>

<details>
<summary><strong>Finance</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateBankAccount` | Bank account with balance |
| `generateLoan` | Loan with terms and payments |
| `generateInsurancePolicy` | Insurance policy |
| `generateCreditCard` | Credit card details |
| `generateTransaction` | Financial transaction |
| `generateSubscription` | Subscription plan |

</details>

<details>
<summary><strong>Content & Media</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateBlogPost` | Blog post with SEO metadata |
| `generateEvent` | Event with tickets and speakers |

</details>

<details>
<summary><strong>Travel & Automotive</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateTravelItinerary` | Travel plan with flights and hotels |
| `generateVehicle` | Vehicle with specifications |

</details>

<details>
<summary><strong>Real Estate</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateProperty` | Property listing with agent info |

</details>

<details>
<summary><strong>Food & Restaurant</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateRestaurant` | Restaurant with hours and features |
| `generateMenuItem` | Menu item with nutrition info |
| `generateFoodOrder` | Food delivery order |

</details>

<details>
<summary><strong>Technical & API</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateApiResponse` | API response with pagination |
| `generateLogEntry` | Application log entry |

</details>

<details>
<summary><strong>Healthcare & Education</strong></summary>

| Generator | Description |
|-----------|-------------|
| `generateMedicalRecord` | Medical record |
| `generateEducation` | Education record |

</details>

---

## Usage Examples

### E-commerce Testing

```javascript
describe('Shopping Flow', () => {
  it('completes checkout with generated data', () => {
    cy.task('generateProduct').then((product) => {
      cy.task('generateCart', { itemCount: 3 }).then((cart) => {
        cy.task('generateUser').then((user) => {
          // Use generated data in your test
          expect(cart.items).to.have.length(3);
          expect(cart.total).to.be.greaterThan(0);
        });
      });
    });
  });

  it('displays order history', () => {
    cy.task('generateOrder', { productCount: 5 }).then((order) => {
      expect(order.products).to.have.length(5);
      expect(order.totalAmount).to.equal(
        order.products.reduce((sum, p) => sum + p.price, 0)
      );
    });
  });
});
```

### Business Application Testing

```javascript
describe('Invoice Management', () => {
  it('creates invoice with line items', () => {
    cy.task('generateInvoice', { itemCount: 5 }).then((invoice) => {
      expect(invoice.invoiceNumber).to.match(/^INV-\d{6}$/);
      expect(invoice.items).to.have.length(5);
      expect(invoice.total).to.be.greaterThan(invoice.subtotal); // Includes tax
    });
  });
});

describe('Employee Directory', () => {
  it('filters by department', () => {
    cy.task('generateEmployee', { department: 'Engineering' }).then((emp) => {
      expect(emp.department).to.equal('Engineering');
      expect(emp.employeeId).to.match(/^EMP-\d{6}$/);
    });
  });
});
```

### Social Features Testing

```javascript
describe('Social Feed', () => {
  it('displays user notifications', () => {
    cy.task('generateNotification', { type: 'payment' }).then((notif) => {
      expect(notif.type).to.equal('payment');
      expect(notif.priority).to.be.oneOf(['low', 'medium', 'high', 'urgent']);
    });
  });

  it('shows social profile', () => {
    cy.task('generateSocialProfile', { platform: 'instagram' }).then((profile) => {
      expect(profile.platform).to.equal('instagram');
      expect(profile.followers).to.be.a('number');
      expect(profile.isVerified).to.be.a('boolean');
    });
  });
});
```

---

## Common Options

All generators accept these common options:

| Option | Type | Description |
|--------|------|-------------|
| `seed` | `number` | Seed for reproducible data generation |
| `locale` | `string` | Locale code (`en`, `de`, `fr`, `es`, etc.) |

### Reproducible Tests with Seeds

```javascript
const seed = 12345;

// These will always generate identical data
cy.task('generateUser', { seed }).then((user1) => {
  cy.task('generateUser', { seed }).then((user2) => {
    expect(user1.email).to.equal(user2.email);
    expect(user1.firstName).to.equal(user2.firstName);
  });
});
```

### Localized Data

```javascript
// German names and addresses
cy.task('generateUser', { locale: 'de' }).then((user) => {
  // User with German-style data
});

// French company
cy.task('generateCompany', { locale: 'fr' }).then((company) => {
  // Company with French-style data
});
```

---

## Schema Validators

The plugin includes reusable schema validators for cleaner tests:

```javascript
import { expectValidUser, expectValidProduct, expectValidOrder } from '../support/schemas';

describe('Data Generation', () => {
  it('generates valid user', () => {
    cy.task('generateUser').then(expectValidUser);
  });

  it('generates valid product', () => {
    cy.task('generateProduct').then(expectValidProduct);
  });

  it('generates valid order', () => {
    cy.task('generateOrder').then(expectValidOrder);
  });
});
```

---

## Error Handling

The plugin provides descriptive errors for invalid inputs:

```javascript
// Invalid age range
cy.task('generateUser', { ageMin: 50, ageMax: 30 }).then((result) => {
  // Returns: { error: 'Max 30 should be greater than min 50' }
});
```

---

## Requirements

| Dependency | Version |
|------------|---------|
| Cypress | 13.0.0+ |
| Node.js | 18+ |

---

## Contributing

Contributions are welcome! Please feel free to submit a [Pull Request](https://github.com/khawjaahmad/cypress-test-data-generator/pulls).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with :heart: by [Ahmad Waqar](https://github.com/khawjaahmad)

</div>
