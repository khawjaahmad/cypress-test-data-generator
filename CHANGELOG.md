# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1] - 2026-04-22

### Changed
- `package.json` bin path normalized from `./bin/ctdg.js` to `bin/ctdg.js` (npm pkg fix). No runtime change.

## [2.1.0] - 2026-04-22

### Added
- **Relational scenarios** — new `cy.scenario({ users, ordersPerUser, productsPerOrder, reviewsPerProduct, seed })` returns users, products, orders, and reviews with guaranteed foreign-key integrity: `order.userId` references a real user, `order.shippingAddress` matches that user's address, `order.products` are sampled from a shared catalog, and `review.productId`/`review.userId` link to real entities. Also available as `cy.generateScenario()` and `cy.task('generateScenario')`. Schema-enforced via `ScenarioSchema` with `superRefine` FK checks.
- **`cy.mockApi(url, options)`** — one-line `cy.intercept` replacement for mocking API endpoints with generated data. Supports `generator`, `count`, `paginated` (wraps in `{ data, meta }` envelope), `status`, `headers`, `delay`, static `body`, relational `scenario`, and custom `transform`.
- **Native Cypress commands** — `cy.generateUser()`, `cy.generateProduct()`, `cy.scenario()`, `cy.mockApi()`, and 40+ others available globally after one import: `import 'cypress-test-data-generator/commands'` in `cypress/support/e2e.js`. Chainable, aliasable, and typed via `src/commands.d.ts` augmenting `Cypress.Chainable`.
- **`dataGenerator.registerTasks(on, config)`** — replaces the ~50-line `on('task', { ... })` block in `cypress.config.js` with a single line.
- **`ctdg` CLI** — the plugin now ships a binary (`npx ctdg`) that generates fixtures outside Cypress. Supports every generator plus `generateScenario`, with flags for `--count`, `--seed`, `--locale`, `--pretty`, `--output`, and `--format json|jsonl`.
- **TypeScript definitions** (`src/index.d.ts`) — all 41 generators, options, and return shapes are fully typed. `generateBulk('generateUser', n)` infers `User[]` via a method-name overload.
- **Runtime Zod schemas** exposed at the subpath `cypress-test-data-generator/schemas` so consumers can validate real API responses against the exact shape the generators produce. `zod ^3.23.0` is an optional peer dependency; only needed if you import the schemas subpath.
- **`strict` option on `generateUser`** — when `{ strict: true }`, invalid options throw instead of returning `{ error: string }`. The default remains `{ error }` for backwards compatibility and will flip in v3.
- **Benchmark script** (`npm run bench`) and **schema parity check** (`npm run schemas:check`) for CI.
- **Seed-isolation regression tests** (`cypress/e2e/isolation.cy.js`).

### Changed
- **Faker instances are now hermetic per call.** Previously, `initFaker` mutated a shared module-level Faker singleton, allowing a seeded call to leak determinism into later unseeded calls (order-dependent flakes). Each generator call now constructs a fresh Faker with its own locale chain. No consumer-visible API change; correctness only.
- Published tarball now uses a `files` whitelist, dropping ~110 kB of test/config artifacts. Subpath `exports` map added for the `/schemas` and `/commands` entry points, with a `./src/*` fallback to preserve any pre-existing deep imports.

### Fixed
- `cypress/e2e/order.cy.js` — the `calculates total amount correctly` assertion used exact float equality against an un-rounded `reduce`, occasionally drifting (`2640.24 !== 2640.2400000000002`). Now uses `closeTo(_, 0.01)` to match the generator's 2-decimal rounding.

### Deprecated
- The `{ error: string }` return shape from `generateUser`. Pass `strict: true` to get the future behavior today; the default will flip in v3.

## [2.0.2] - 2025-01-05

### Changed
- Beautified README with badges, collapsible sections, and usage examples
- Updated all project documentation

## [2.0.0] - 2025-01-05

### Added

#### New Generator Categories
- **Social & Communication**: `generateSocialProfile`, `generateComment`, `generateNotification`, `generateMessage`
- **Business & Enterprise**: `generateInvoice`, `generateEmployee`, `generateProject`, `generateTicket`, `generateMeeting`
- **Finance**: `generateBankAccount`, `generateLoan`, `generateInsurancePolicy`, `generateCreditCard`, `generateTransaction`, `generateSubscription`
- **Content & Media**: `generateBlogPost`, `generateEvent`
- **Real Estate**: `generateProperty`
- **Food & Restaurant**: `generateRestaurant`, `generateMenuItem`, `generateFoodOrder`
- **Technical & API**: `generateApiResponse`, `generateLogEntry`

#### New E-commerce Generators
- `generateCart` - Shopping cart with items
- `generateWishlist` - User wishlists
- `generateReturn` - Return/refund requests
- `generateAddress` - Standalone address generation

#### Architecture Improvements
- Modular generator structure with separate files per domain
- Centralized schema validators in `cypress/support/schemas.js`
- Plugin system for extensibility
- Utility functions for faker initialization and validation

### Changed
- Upgraded Cypress from 13.x to 15.8.1
- Upgraded @faker-js/faker from 8.x to 10.2.0
- Fixed all deprecated Faker.js API calls
- Improved seed functionality for reproducible data
- Enhanced locale support across all generators
- Refactored codebase with modular architecture

### Fixed
- Deprecated `faker.name.*` replaced with `faker.person.*`
- Deprecated `faker.address.*` replaced with `faker.location.*`
- Deprecated `faker.datatype.*` replaced with appropriate modules
- Deprecated `faker.random.*` replaced with `faker.helpers.*`

## [1.1.1] - 2024-10-19

### Changed
- Updated README for clarity and conciseness

## [1.1.0] - 2024-10-19

### Added
- New `generateVehicle` function with comprehensive tests
- New `generateCompany` function with tests
- New `generateEducation` function with tests
- New `generateTravelItinerary` function with tests
- New `generateMedicalRecord` function with tests

### Changed
- Enhanced `generateJobListing` function with additional tests
- Updated README with details for all new and updated generators
- Updated plugin entry in Cypress documentation

## [1.0.2] - 2024-09-30

### Added
- Initial release of cypress-test-data-generator
- Included functions for generating user, product, order, and review data
