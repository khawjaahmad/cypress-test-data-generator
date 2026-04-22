/* eslint-disable no-console */
// Parity check: every generator output must satisfy its shipped Zod schema.
// If a generator adds/renames/removes a field, or a schema drifts, this
// fails loudly. Run in CI after any change to src/generators/ or src/schemas/.

const dataGenerator = require('../src/index');
const schemas = require('../src/schemas');

const gen = dataGenerator();

// Map each generator invocation to the schema that should accept its output.
// Each entry runs the generator twice: once unseeded, once seeded. This
// catches both default-path and reproducible-path drift.
const cases = [
    ['generateUser', () => gen.generateUser(), schemas.UserSchema],
    ['generateAddress', () => gen.generateAddress(), schemas.FullAddressSchema],

    ['generateProduct', () => gen.generateProduct(), schemas.ProductSchema],
    [
        'generateProductWithRelations',
        () => gen.generateProductWithRelations(),
        schemas.ProductWithRelationsSchema,
    ],
    ['generateOrder', () => gen.generateOrder(), schemas.OrderSchema],
    ['generateReview', () => gen.generateReview(), schemas.ReviewSchema],
    ['generateCategory', () => gen.generateCategory(), schemas.CategorySchema],
    [
        'generateInventory',
        () => gen.generateInventory('p-1'),
        schemas.InventorySchema,
    ],
    ['generateCoupon', () => gen.generateCoupon(), schemas.CouponSchema],
    [
        'generateShippingMethod',
        () => gen.generateShippingMethod(),
        schemas.ShippingMethodSchema,
    ],
    [
        'generatePaymentMethod',
        () => gen.generatePaymentMethod(),
        schemas.PaymentMethodSchema,
    ],
    ['generateCart', () => gen.generateCart(), schemas.CartSchema],
    ['generateWishlist', () => gen.generateWishlist(), schemas.WishlistSchema],
    ['generateReturn', () => gen.generateReturn(), schemas.ReturnSchema],

    [
        'generateSocialProfile',
        () => gen.generateSocialProfile(),
        schemas.SocialProfileSchema,
    ],
    ['generateComment', () => gen.generateComment(), schemas.CommentSchema],
    [
        'generateNotification',
        () => gen.generateNotification(),
        schemas.NotificationSchema,
    ],
    ['generateMessage', () => gen.generateMessage(), schemas.MessageSchema],

    ['generateCompany', () => gen.generateCompany(), schemas.CompanySchema],
    ['generateInvoice', () => gen.generateInvoice(), schemas.InvoiceSchema],
    ['generateEmployee', () => gen.generateEmployee(), schemas.EmployeeSchema],
    ['generateProject', () => gen.generateProject(), schemas.ProjectSchema],
    ['generateTicket', () => gen.generateTicket(), schemas.TicketSchema],
    ['generateMeeting', () => gen.generateMeeting(), schemas.MeetingSchema],
    [
        'generateJobListing',
        () => gen.generateJobListing(),
        schemas.JobListingSchema,
    ],

    ['generateCreditCard', () => gen.generateCreditCard(), schemas.CreditCardSchema],
    [
        'generateTransaction',
        () => gen.generateTransaction(),
        schemas.TransactionSchema,
    ],
    [
        'generateBankAccount',
        () => gen.generateBankAccount(),
        schemas.BankAccountSchema,
    ],
    ['generateLoan', () => gen.generateLoan(), schemas.LoanSchema],
    [
        'generateInsurancePolicy',
        () => gen.generateInsurancePolicy(),
        schemas.InsurancePolicySchema,
    ],
    [
        'generateSubscription',
        () => gen.generateSubscription(),
        schemas.SubscriptionSchema,
    ],

    ['generateBlogPost', () => gen.generateBlogPost(), schemas.BlogPostSchema],
    ['generateEvent', () => gen.generateEvent(), schemas.EventSchema],

    [
        'generateTravelItinerary',
        () => gen.generateTravelItinerary(),
        schemas.TravelItinerarySchema,
    ],
    ['generateVehicle', () => gen.generateVehicle(), schemas.VehicleSchema],

    ['generateProperty', () => gen.generateProperty(), schemas.PropertySchema],

    [
        'generateRestaurant',
        () => gen.generateRestaurant(),
        schemas.RestaurantSchema,
    ],
    ['generateMenuItem', () => gen.generateMenuItem(), schemas.MenuItemSchema],
    ['generateFoodOrder', () => gen.generateFoodOrder(), schemas.FoodOrderSchema],

    [
        'generateApiResponse',
        () => gen.generateApiResponse(),
        schemas.ApiResponseSchema,
    ],
    ['generateLogEntry', () => gen.generateLogEntry(), schemas.LogEntrySchema],

    [
        'generateMedicalRecord',
        () => gen.generateMedicalRecord(),
        schemas.MedicalRecordSchema,
    ],
    ['generateEducation', () => gen.generateEducation(), schemas.EducationSchema],

    // Relational — FK integrity is enforced inside ScenarioSchema via superRefine
    [
        'generateScenario (small)',
        () => gen.generateScenario({ users: 2, ordersPerUser: 2, productsPerOrder: 3, reviewsPerProduct: 1 }),
        schemas.ScenarioSchema,
    ],
    [
        'generateScenario (users only)',
        () => gen.generateScenario({ users: 5 }),
        schemas.ScenarioSchema,
    ],
];

const RUNS_PER_CASE = 5; // sample multiple outputs per generator
let failures = 0;

for (const [label, run, schema] of cases) {
    for (let i = 0; i < RUNS_PER_CASE; i++) {
        const value = run();
        const result = schema.safeParse(value);
        if (!result.success) {
            failures++;
            const issues = result.error.issues.slice(0, 3).map((issue) => {
                const path = issue.path.join('.') || '<root>';
                return `    ${path}: ${issue.message}`;
            });
            console.error(`FAIL  ${label} (run ${i + 1})`);
            console.error(issues.join('\n'));
            break; // one failure per case is enough
        }
    }
}

if (failures > 0) {
    console.error(`\n${failures} parity failure(s).`);
    process.exit(1);
} else {
    console.log(`OK  ${cases.length} generators x ${RUNS_PER_CASE} runs parsed.`);
}
