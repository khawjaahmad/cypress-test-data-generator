// Type definitions for cypress-test-data-generator/schemas
//
// Opt-in runtime schemas matching the shapes produced by the generators.
// Requires `zod` as an optional peer dependency.

import type { z } from 'zod';

// ============================================================
// COMMON
// ============================================================

export declare const AddressSchema: z.ZodObject<{
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    zipCode: z.ZodString;
    country: z.ZodString;
}>;

export declare const CoordinatesSchema: z.ZodObject<{
    latitude: z.ZodNumber;
    longitude: z.ZodNumber;
}>;

export declare const AddressWithCoordinatesSchema: z.ZodObject<{
    street: z.ZodString;
    city: z.ZodString;
    state: z.ZodString;
    zipCode: z.ZodString;
    country: z.ZodString;
    coordinates: typeof CoordinatesSchema;
}>;

export declare const PersonRefSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
}>;

export declare const ContactRefSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
}>;

// ============================================================
// All other schemas are exported as opaque `z.ZodTypeAny`.
//
// Rationale: writing out the full structural Zod type for each schema
// (e.g. z.ZodObject<{ ... 40 nested fields ... }>) duplicates the
// object structure that already lives in the main package's index.d.ts.
// Consumers get correct runtime validation + `z.infer<typeof Schema>`
// produces the inferred type, which they can compare to the types from
// the main entry if desired.
// ============================================================

export declare const UserSchema: z.ZodTypeAny;
export declare const FullAddressSchema: z.ZodTypeAny;

export declare const ProductSchema: z.ZodTypeAny;
export declare const ProductWithRelationsSchema: z.ZodTypeAny;
export declare const OrderSchema: z.ZodTypeAny;
export declare const ReviewSchema: z.ZodTypeAny;
export declare const CategorySchema: z.ZodTypeAny;
export declare const InventorySchema: z.ZodTypeAny;
export declare const CouponSchema: z.ZodTypeAny;
export declare const ShippingMethodSchema: z.ZodTypeAny;
export declare const PaymentMethodSchema: z.ZodTypeAny;
export declare const CartItemSchema: z.ZodTypeAny;
export declare const CartSchema: z.ZodTypeAny;
export declare const WishlistItemSchema: z.ZodTypeAny;
export declare const WishlistSchema: z.ZodTypeAny;
export declare const ReturnItemSchema: z.ZodTypeAny;
export declare const ReturnSchema: z.ZodTypeAny;

export declare const SocialPlatformSchema: z.ZodTypeAny;
export declare const SocialProfileSchema: z.ZodTypeAny;
export declare const CommentSchema: z.ZodTypeAny;
export declare const NotificationTypeSchema: z.ZodTypeAny;
export declare const NotificationSchema: z.ZodTypeAny;
export declare const MessageReactionSchema: z.ZodTypeAny;
export declare const MessageSchema: z.ZodTypeAny;

export declare const CompanySchema: z.ZodTypeAny;
export declare const InvoiceItemSchema: z.ZodTypeAny;
export declare const InvoiceClientSchema: z.ZodTypeAny;
export declare const InvoiceSchema: z.ZodTypeAny;
export declare const EmployeeSchema: z.ZodTypeAny;
export declare const ProjectSchema: z.ZodTypeAny;
export declare const TicketSchema: z.ZodTypeAny;
export declare const MeetingLocationSchema: z.ZodTypeAny;
export declare const MeetingSchema: z.ZodTypeAny;
export declare const JobListingSchema: z.ZodTypeAny;

export declare const CreditCardSchema: z.ZodTypeAny;
export declare const TransactionSchema: z.ZodTypeAny;
export declare const BankAccountSchema: z.ZodTypeAny;
export declare const LoanTypeSchema: z.ZodTypeAny;
export declare const LoanSchema: z.ZodTypeAny;
export declare const InsurancePolicyTypeSchema: z.ZodTypeAny;
export declare const InsurancePolicySchema: z.ZodTypeAny;
export declare const SubscriptionSchema: z.ZodTypeAny;

export declare const BlogPostSchema: z.ZodTypeAny;
export declare const EventTicketSchema: z.ZodTypeAny;
export declare const EventSpeakerSchema: z.ZodTypeAny;
export declare const EventSchema: z.ZodTypeAny;

export declare const TravelItinerarySchema: z.ZodTypeAny;
export declare const VehicleSchema: z.ZodTypeAny;

export declare const PropertyTypeSchema: z.ZodTypeAny;
export declare const PropertySchema: z.ZodTypeAny;

export declare const RestaurantHoursSchema: z.ZodTypeAny;
export declare const RestaurantSchema: z.ZodTypeAny;
export declare const MenuItemSchema: z.ZodTypeAny;
export declare const FoodOrderItemSchema: z.ZodTypeAny;
export declare const FoodOrderDeliveryAddressSchema: z.ZodTypeAny;
export declare const FoodOrderSchema: z.ZodTypeAny;

export declare const ApiResponseSchema: z.ZodTypeAny;
export declare const LogLevelSchema: z.ZodTypeAny;
export declare const LogEntrySchema: z.ZodTypeAny;

export declare const MedicalRecordSchema: z.ZodTypeAny;
export declare const EducationSchema: z.ZodTypeAny;

export declare const ScenarioOrderSchema: z.ZodTypeAny;
export declare const ScenarioReviewSchema: z.ZodTypeAny;
export declare const ScenarioSchema: z.ZodTypeAny;
