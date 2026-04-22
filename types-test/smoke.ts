// Type smoke test. Compiled with `tsc --noEmit` in CI. Not shipped.
// Asserts the public .d.ts shapes compile and narrow correctly.
//
// If you add a generator, add at least one line here that exercises its
// options and return type so TS will catch missing or wrong typings.

import dataGenerator from '../src';

// The default-import binding carries the merged namespace, so types
// declared inside `declare namespace dataGenerator { ... }` are
// accessible as `dataGenerator.User`, `dataGenerator.Product`, etc.

// Helper: compile-time assertion that two types are equivalent.
type Expect<T extends true> = T;
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;

const gen = dataGenerator();

// ------------------------------------------------------------------
// Core
// ------------------------------------------------------------------

gen.setSeed(42);
gen.setSeed('42');
gen.setSeed(null);
gen.setLocale('de');
gen.setLocale('en');
gen.setLocale('custom-locale-code'); // string & {} escape hatch

gen.registerPlugin((data) => ({ ...(data as object) }));

// ------------------------------------------------------------------
// Generators — exercise every method name in GeneratorReturnMap
// ------------------------------------------------------------------

const user = gen.generateUser({ seed: 1, locale: 'de', ageMin: 20, ageMax: 30 });
if (!('error' in user)) {
    const _userCheck: Expect<Equal<typeof user.firstName, string>> = true;
    const _addressCheck: Expect<Equal<typeof user.address.street, string>> = true;
    void _userCheck;
    void _addressCheck;
}

// strict:true narrows the return to User — no ErrorResult in the union
const strictUser = gen.generateUser({ seed: 1, strict: true });
const _strictUserCheck: Expect<Equal<typeof strictUser, dataGenerator.User>> = true;
void _strictUserCheck;
void strictUser.firstName; // no 'error' in ...' narrowing needed

const address = gen.generateAddress();
const _addrCheck: Expect<Equal<typeof address.latitude, number>> = true;
void _addrCheck;

const product = gen.generateProduct({ customFields: { priority: 'high' } });
const _productCheck: Expect<Equal<typeof product.price, number>> = true;
void _productCheck;

const productWithRel = gen.generateProductWithRelations({ relatedProductCount: 2 });
void productWithRel.relatedProducts[0]?.relatedToProductId;

const order = gen.generateOrder({ productCount: 5 });
void order.totalAmount;
void order.products[0]?.name;

const review = gen.generateReview({ productId: 'p-1' });
void review.rating;

const category = gen.generateCategory({ parentId: null });
void category.slug;

const inventory = gen.generateInventory('p-1', { seed: 1 });
void inventory.quantity;

const coupon = gen.generateCoupon();
void coupon.discountType;

const shipping = gen.generateShippingMethod();
void shipping.estimatedDeliveryDays;

const payment = gen.generatePaymentMethod();
void payment.lastFour;

const cart = gen.generateCart({ itemCount: 4 });
void cart.items[0]?.variant;

const wishlist = gen.generateWishlist({ itemCount: 2 });
void wishlist.items[0]?.priority;

const ret = gen.generateReturn({ orderId: 'o-1' });
void ret.refundMethod;

const social = gen.generateSocialProfile({ platform: 'instagram' });
void social.isVerified;

const comment = gen.generateComment({ postId: 'p-1', parentId: null });
void comment.content;

const notif = gen.generateNotification({ type: 'payment' });
void notif.priority;

const msg = gen.generateMessage({ conversationId: 'c-1' });
void msg.reactions[0]?.emoji;

const company = gen.generateCompany();
void company.stockSymbol;

const invoice = gen.generateInvoice({ itemCount: 10 });
void invoice.client.address.zipCode;
void invoice.paymentTerms;

const emp = gen.generateEmployee({ department: 'Engineering' });
void emp.salary.amount;

const project = gen.generateProject();
void project.budget.allocated;

const ticket = gen.generateTicket({ customerId: 'c-1' });
void ticket.channel;

const meeting = gen.generateMeeting();
if (meeting.location.type === 'virtual') {
    void meeting.location.platform; // narrow to virtual
}

const job = gen.generateJobListing();
void job.salary.max;

const cc = gen.generateCreditCard();
void cc.cvv;

const tx = gen.generateTransaction();
void tx.amount;

const bank = gen.generateBankAccount();
void bank.iban;

const loan = gen.generateLoan({ type: 'mortgage' });
void loan.borrower.creditScore;

const policy = gen.generateInsurancePolicy({ type: 'life' });
void policy.claims[0]?.amount;

const sub = gen.generateSubscription();
void sub.billingCycle;

const post = gen.generateBlogPost();
void post.seo.metaTitle;

const event = gen.generateEvent();
void event.venue.coordinates.latitude;

const trip = gen.generateTravelItinerary();
void trip.flightDetails.airline;

const vehicle = gen.generateVehicle();
void vehicle.vin;

const property = gen.generateProperty({ type: 'condo' });
void property.address.coordinates.longitude;

const restaurant = gen.generateRestaurant();
void restaurant.hours.monday.open;

const menu = gen.generateMenuItem({ restaurantId: 'r-1' });
void menu.nutritionInfo.protein;

const foodOrder = gen.generateFoodOrder({ itemCount: 3 });
void foodOrder.tip;

const api = gen.generateApiResponse({ success: true });
void api.meta.rateLimit.limit;

const log = gen.generateLogEntry({ level: 'error' });
void log.method;

const med = gen.generateMedicalRecord();
void med.bloodType;

const edu = gen.generateEducation();
void edu.gpa;

// ------------------------------------------------------------------
// Bulk — method-name overload returns correctly-typed array
// ------------------------------------------------------------------

const users = gen.generateBulk('generateUser', 10, { seed: 1 });
const _bulkUsersCheck: Expect<Equal<typeof users, dataGenerator.User[]>> = true;
void _bulkUsersCheck;

const products = gen.generateBulk('generateProduct', 5);
const _bulkProductsCheck: Expect<Equal<typeof products, dataGenerator.Product[]>> = true;
void _bulkProductsCheck;

// Bulk with callback — return type inferred from callback
const customs = gen.generateBulk((opts) => ({ label: opts.seed ?? 'x' }), 3);
const _customBulkCheck: Expect<Equal<typeof customs, Array<{ label: number | string }>>> = true;
void _customBulkCheck;

// ------------------------------------------------------------------
// Negative tests — these should fail to compile if uncommented
// ------------------------------------------------------------------

// gen.generateUser({ ageMin: 'not a number' });           // $ExpectError
// gen.generateBulk('generateDoesNotExist', 3);            // $ExpectError
// gen.generateSocialProfile({ platform: 'myspace' });     // $ExpectError — not in SocialPlatform union
// gen.generateInvoice({ itemCount: 'ten' });              // $ExpectError

export {};
