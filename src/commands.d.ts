// Global Cypress namespace augmentation so TypeScript knows about
// cy.generateUser(), cy.scenario(), cy.mockApi(), etc.
//
// Imported automatically when consumers load `cypress-test-data-generator/commands`.

import type * as DG from '.';

declare global {
    namespace Cypress {
        interface MockApiOptions<TBody = unknown> {
            /** HTTP method to intercept. Default: 'GET'. */
            method?:
                | 'GET'
                | 'POST'
                | 'PUT'
                | 'PATCH'
                | 'DELETE'
                | 'HEAD'
                | 'OPTIONS';
            /** Name of a generator to produce the response body. */
            generator?: keyof DG.GeneratorReturnMap;
            /** Number of items to generate. Default: 10. */
            count?: number;
            /** Seed for reproducible data. */
            seed?: number | string;
            /** Locale for generated data. */
            locale?: DG.Locale;
            /** Wrap the response in a { data, meta } pagination envelope. */
            paginated?: boolean;
            /** Page number for paginated mode. Default: 1. */
            page?: number;
            /** Page size for paginated mode. Default: count. */
            pageSize?: number;
            /** Total items reported in pagination meta. Default: count. */
            total?: number;
            /** HTTP status code. Default: 200. */
            status?: number;
            /** Response headers to set. */
            headers?: Record<string, string>;
            /** Artificial response delay in ms. */
            delay?: number;
            /** Static response body — bypasses generation entirely. */
            body?: TBody;
            /** Use a relational scenario as the body. */
            scenario?: DG.ScenarioOptions;
            /** Transform the generated body before serving. */
            transform?: (body: any) => any;
        }

        interface Chainable<Subject = any> {
            // Core generators
            generateUser(options: DG.StrictUserOptions): Chainable<DG.User>;
            generateUser(
                options?: DG.UserOptions
            ): Chainable<DG.User | DG.ErrorResult>;
            generateAddress(options?: DG.BaseOptions): Chainable<DG.FullAddress>;

            // E-commerce
            generateProduct(options?: DG.ProductOptions): Chainable<DG.Product>;
            generateProductWithRelations(
                options?: DG.ProductWithRelationsOptions
            ): Chainable<DG.ProductWithRelations>;
            generateOrder(options?: DG.OrderOptions): Chainable<DG.Order>;
            generateReview(options?: DG.ReviewOptions): Chainable<DG.Review>;
            generateCategory(options?: DG.CategoryOptions): Chainable<DG.Category>;
            generateInventory(
                productId: string,
                options?: DG.BaseOptions
            ): Chainable<DG.Inventory>;
            generateCoupon(options?: DG.BaseOptions): Chainable<DG.Coupon>;
            generateShippingMethod(
                options?: DG.BaseOptions
            ): Chainable<DG.ShippingMethod>;
            generatePaymentMethod(
                options?: DG.BaseOptions
            ): Chainable<DG.PaymentMethod>;
            generateCart(options?: DG.CartOptions): Chainable<DG.Cart>;
            generateWishlist(options?: DG.WishlistOptions): Chainable<DG.Wishlist>;
            generateReturn(options?: DG.ReturnOptions): Chainable<DG.Return>;

            // Social
            generateSocialProfile(
                options?: DG.SocialProfileOptions
            ): Chainable<DG.SocialProfile>;
            generateComment(options?: DG.CommentOptions): Chainable<DG.Comment>;
            generateNotification(
                options?: DG.NotificationOptions
            ): Chainable<DG.Notification>;
            generateMessage(options?: DG.MessageOptions): Chainable<DG.Message>;

            // Business
            generateCompany(options?: DG.BaseOptions): Chainable<DG.Company>;
            generateInvoice(options?: DG.InvoiceOptions): Chainable<DG.Invoice>;
            generateEmployee(options?: DG.EmployeeOptions): Chainable<DG.Employee>;
            generateProject(options?: DG.BaseOptions): Chainable<DG.Project>;
            generateTicket(options?: DG.TicketOptions): Chainable<DG.Ticket>;
            generateMeeting(options?: DG.BaseOptions): Chainable<DG.Meeting>;
            generateJobListing(
                options?: DG.BaseOptions
            ): Chainable<DG.JobListing>;

            // Finance
            generateCreditCard(options?: DG.BaseOptions): Chainable<DG.CreditCard>;
            generateTransaction(
                options?: DG.BaseOptions
            ): Chainable<DG.Transaction>;
            generateBankAccount(
                options?: DG.BaseOptions
            ): Chainable<DG.BankAccount>;
            generateLoan(options?: DG.LoanOptions): Chainable<DG.Loan>;
            generateInsurancePolicy(
                options?: DG.InsurancePolicyOptions
            ): Chainable<DG.InsurancePolicy>;
            generateSubscription(
                options?: DG.BaseOptions
            ): Chainable<DG.Subscription>;

            // Content
            generateBlogPost(options?: DG.BaseOptions): Chainable<DG.BlogPost>;
            generateEvent(options?: DG.BaseOptions): Chainable<DG.Event>;

            // Travel
            generateTravelItinerary(
                options?: DG.BaseOptions
            ): Chainable<DG.TravelItinerary>;
            generateVehicle(options?: DG.BaseOptions): Chainable<DG.Vehicle>;

            // Real estate
            generateProperty(options?: DG.PropertyOptions): Chainable<DG.Property>;

            // Food
            generateRestaurant(options?: DG.BaseOptions): Chainable<DG.Restaurant>;
            generateMenuItem(
                options?: DG.MenuItemOptions
            ): Chainable<DG.MenuItem>;
            generateFoodOrder(
                options?: DG.FoodOrderOptions
            ): Chainable<DG.FoodOrder>;

            // Technical
            generateApiResponse(
                options?: DG.ApiResponseOptions
            ): Chainable<DG.ApiResponse>;
            generateLogEntry(
                options?: DG.LogEntryOptions
            ): Chainable<DG.LogEntry>;

            // Healthcare & education
            generateMedicalRecord(
                options?: DG.BaseOptions
            ): Chainable<DG.MedicalRecord>;
            generateEducation(
                options?: DG.BaseOptions
            ): Chainable<DG.Education>;

            // Relational (method-name overload — typed return)
            generateScenario(
                options?: DG.ScenarioOptions
            ): Chainable<DG.Scenario>;
            /** Short alias for `cy.generateScenario`. */
            scenario(options?: DG.ScenarioOptions): Chainable<DG.Scenario>;

            // Bulk
            generateBulk<K extends keyof DG.GeneratorReturnMap>(
                generator: K,
                count: number,
                options?: DG.BaseOptions
            ): Chainable<Array<DG.GeneratorReturnMap[K]>>;

            /**
             * Install an intercept that serves generated data.
             * @see DG.MockApiOptions
             */
            mockApi<T = unknown>(
                url: string | RegExp,
                options?: MockApiOptions<T>
            ): Chainable<T>;
        }
    }
}

export {};
