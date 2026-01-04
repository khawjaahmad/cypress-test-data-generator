# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
