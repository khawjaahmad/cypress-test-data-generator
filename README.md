<div align="center">

# Cypress Test Data Generator

**Generate realistic, reproducible test data for Cypress tests**

[![npm version](https://img.shields.io/npm/v/cypress-test-data-generator.svg?style=flat-square)](https://www.npmjs.com/package/cypress-test-data-generator)
[![npm downloads](https://img.shields.io/npm/dm/cypress-test-data-generator.svg?style=flat-square)](https://www.npmjs.com/package/cypress-test-data-generator)
[![license](https://img.shields.io/npm/l/cypress-test-data-generator.svg?style=flat-square)](https://github.com/khawjaahmad/cypress-test-data-generator/blob/main/LICENSE)

[Installation](#installation) •
[Quick Start](#quick-start) •
[Scenarios](#relational-scenarios--cyscenario) •
[Mocking](#api-mocking--cymockapi) •
[CLI](#outside-cypress--the-ctdg-cli) •
[Schemas](#runtime-schemas) •
[Generators](#available-generators)

</div>

---

## Why This Plugin?

Writing realistic test data by hand is tedious and error-prone. This plugin provides **40+ data generators** powered by [Faker.js](https://fakerjs.dev/) plus the Cypress-native wiring to use them without boilerplate.

```javascript
// Before: manual test data
const user = { name: 'Test User', email: 'test@test.com', age: 25 };

// After: rich, realistic, reproducible
cy.generateUser({ seed: 42 }).then((user) => {
  // { id, firstName, lastName, email, age, address: { street, city, state, zipCode, country } }
});
```

### Key Features

- **40+ Generators** — Users, products, orders, invoices, social profiles, and more
- **Relational scenarios** — `cy.scenario({ users, ordersPerUser, productsPerOrder })` returns linked entities with guaranteed foreign keys (no manual ID wiring)
- **One-line API mocking** — `cy.mockApi('/api/users', { generator: 'generateUser', count: 20, paginated: true })` replaces ~15 lines of `cy.intercept` boilerplate
- **Native Cypress commands** — `cy.generateUser()`, `cy.scenario()`, `cy.mockApi()`, and 40+ more, chainable and aliasable
- **`ctdg` CLI** — generate fixtures outside Cypress (`npx ctdg generateUser --count 1000 --seed 42 -o users.json`)
- **Runtime Zod schemas** — validate real API responses against the exact shape the generator produces
- **Reproducible Data** — seed support, with hermetic per-call Faker instances that never leak state between calls
- **Internationalization** — 10 built-in locales (en, de, fr, es, it, pt_BR, ja, zh_CN, ko, ru) with automatic fallback to `en` for unknown codes
- **Fully typed** — TypeScript definitions shipped for every generator, option, and return shape

---

## Installation

```bash
npm install --save-dev cypress-test-data-generator

# Optional: install zod only if you plan to use the schemas subpath
npm install --save-dev zod
```

## Setup

**1.** Register the tasks in `cypress.config.js`:

```javascript
const { defineConfig } = require('cypress');
const dataGenerator = require('cypress-test-data-generator');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      dataGenerator.registerTasks(on, config);
      return config;
    },
  },
});
```

**2.** Load the native Cypress commands in `cypress/support/e2e.js`:

```javascript
import 'cypress-test-data-generator/commands';
```

That's it. You now have `cy.generateUser()`, `cy.scenario()`, `cy.mockApi()`, and 40+ other chainable commands available in every spec.

---

## Quick Start

```javascript
// Native Cypress commands — chainable, aliasable, fully typed
cy.generateUser({ seed: 12345, locale: 'de' }).as('user');
cy.get('@user').then((user) => {
  cy.visit('/register');
  cy.get('#email').type(user.email);
});

// Relational data — one call, full FK integrity
cy.scenario({ users: 3, ordersPerUser: 2, productsPerOrder: 4 }).then((s) => {
  // s.orders[0].userId === s.users[i].id for some i
  // s.orders[0].products are real entries from s.products
  // s.orders[0].shippingAddress === the user's address
});

// Kill cy.intercept boilerplate — one line mocks an endpoint with generated data
cy.mockApi('/api/users', {
  generator: 'generateUser',
  count: 20,
  paginated: true,   // wraps in { data, meta } envelope
  seed: 42,
}).as('users');
cy.visit('/users');
cy.wait('@users');

// Raw cy.task still works if you prefer
cy.task('generateProduct', { seed: 1 });
```

---

## Relational Scenarios — `cy.scenario()`

Instead of manually wiring IDs between `generateUser`/`generateOrder`/`generateReview` calls, generate a linked bundle in one shot:

```javascript
cy.scenario({
  users: 3,              // 3 users
  ordersPerUser: 2,      // 6 orders total, each tied to a user
  productsPerOrder: 4,   // each order contains 4 products from a shared catalog
  reviewsPerProduct: 1,  // each product gets 1 review by a random user
  seed: 42,              // reproducible
}).then(({ users, products, orders, reviews }) => {
  // Foreign keys are guaranteed:
  //   order.userId       → real users[i].id
  //   order.shippingAddress → users[i].address
  //   order.products[]   → entries from the shared `products` catalog
  //   review.productId   → real products[i].id
  //   review.userId      → real users[i].id
});
```

---

## API Mocking — `cy.mockApi()`

One line replaces ~15 lines of `cy.intercept` + fixture + pagination boilerplate.

```javascript
// Basic list endpoint
cy.mockApi('/api/users', { generator: 'generateUser', count: 20 });

// Paginated
cy.mockApi('/api/products', {
  generator: 'generateProduct',
  count: 10,
  paginated: true,
  page: 1,
  pageSize: 10,
  total: 247,
});
// → { data: [...10 products], meta: { page, pageSize, total, totalPages } }

// Error case
cy.mockApi('/api/users/999', { status: 404, body: { error: 'not found' } });

// Relational bundle
cy.mockApi('/api/bootstrap', { scenario: { users: 3, ordersPerUser: 2 } });

// Transform before serving
cy.mockApi('/api/suggestions', {
  generator: 'generateProduct',
  count: 50,
  transform: (items) => items.slice(0, 3).map((p) => p.name),
});
```

All options: `method`, `generator`, `count`, `seed`, `locale`, `paginated`, `page`, `pageSize`, `total`, `status`, `headers`, `delay`, `body`, `scenario`, `transform`.

---

## Outside Cypress — the `ctdg` CLI

The plugin ships a `ctdg` binary so you can generate deterministic test data outside Cypress — for Jest, Playwright, Storybook, local dev seeding, CI bootstrap scripts, or anywhere you need realistic fixtures.

```bash
# A single user
npx ctdg generateUser --seed 42 --pretty

# 1000 products as an array, written to a file
npx ctdg generateProduct --count 1000 --seed 1 -o fixtures/products.json

# Newline-delimited JSON — great for piping into tools
npx ctdg generateUser --count 500 --format jsonl > users.jsonl

# Relational bundle
npx ctdg generateScenario \
  --users 3 --ordersPerUser 2 --productsPerOrder 4 --reviewsPerProduct 1 \
  --seed 42 -o fixtures/scenario.json

# Localized
npx ctdg generateUser --locale de --count 10

# Discover what's available
npx ctdg --list
npx ctdg --help
```

Use it in a package.json script to bake fixtures as part of your build:

```json
{
  "scripts": {
    "fixtures:generate": "ctdg generateScenario --users 50 --ordersPerUser 5 --seed 1 -o src/__fixtures__/scenario.json"
  }
}
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
      const sum = order.products.reduce((acc, p) => acc + p.price, 0);
      // totalAmount is rounded to 2 decimals, so compare with tolerance.
      expect(order.totalAmount).to.be.closeTo(sum, 0.01);
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
| `seed` | `number \| string` | Seed for reproducible data generation |
| `locale` | `string` | Locale code — `en`, `de`, `fr`, `es`, `it`, `pt_BR`, `ja`, `zh_CN`, `ko`, or `ru`. Unknown codes fall back to `en`. |
| `strict` | `boolean` | *(generateUser only)* Throw on invalid input instead of returning `{ error }`. Will become the default in v3. |

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

## Runtime Schemas

Every generator ships a matching [Zod](https://zod.dev) schema at the `cypress-test-data-generator/schemas` subpath. Validate real API responses against the exact shape the generator produces — one source of truth for tests and contracts:

```javascript
import {
  UserSchema,
  ProductSchema,
  OrderSchema,
} from 'cypress-test-data-generator/schemas';

describe('Checkout API', () => {
  it('backend returns the same User shape the generator produces', () => {
    cy.request('/api/users/123').then(({ body }) => {
      const result = UserSchema.safeParse(body);
      expect(result.success, JSON.stringify(result.error)).to.be.true;
    });
  });
});
```

Schemas are also usable for asserting generator output directly:

```javascript
cy.task('generateOrder', { productCount: 3 }).then((order) => {
  expect(OrderSchema.safeParse(order).success).to.be.true;
});
```

> `zod` is an **optional peer dependency** — only install it if you import the schemas subpath. Install with `npm install --save-dev zod`.

---

## Error Handling

By default, `generateUser` returns an `{ error: string }` object on invalid input so tests can continue:

```javascript
cy.task('generateUser', { ageMin: 50, ageMax: 30 }).then((result) => {
  // Returns: { error: 'Max 30 should be greater than min 50' }
});
```

### Strict mode (recommended)

Pass `strict: true` to make invalid input throw. Test runners surface this as a clear failure instead of silently passing malformed data downstream:

```javascript
cy.task('generateUser', { strict: true, ageMin: 50, ageMax: 30 });
// → task rejects, test fails with 'Max 30 should be greater than min 50'
```

> **Deprecation notice.** The default `{ error }` return shape will be removed in **v3** — `strict: true` will become the default. Adopt `strict` in new code to avoid a future breaking change.

All other generators already throw on invalid input (e.g. `generateOrder({ productCount: 0 })`).

---

## Requirements

| Dependency | Version | Notes |
|------------|---------|-------|
| Cypress | 13.0.0+ | Required |
| Node.js | 18+ | Required |
| zod | 3.23.0+ | Optional peer — only if you use `cypress-test-data-generator/schemas` |

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

Made by [Ahmad Waqar](https://github.com/khawjaahmad)

</div>
