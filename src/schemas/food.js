const { z } = require('zod');
const { AddressSchema, CoordinatesSchema, ContactRefSchema } = require('./common');

const RestaurantHoursSchema = z.object({
    open: z.string(),
    close: z.string(),
});

const RestaurantSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    cuisine: z.array(z.string()),
    priceRange: z.enum(['$', '$$', '$$$', '$$$$']),
    rating: z.number(),
    reviewCount: z.number().int(),
    address: AddressSchema,
    coordinates: CoordinatesSchema,
    phone: z.string(),
    email: z.string(),
    website: z.string(),
    hours: z.object({
        monday: RestaurantHoursSchema,
        tuesday: RestaurantHoursSchema,
        wednesday: RestaurantHoursSchema,
        thursday: RestaurantHoursSchema,
        friday: RestaurantHoursSchema,
        saturday: RestaurantHoursSchema,
        sunday: RestaurantHoursSchema,
    }),
    features: z.array(z.string()),
    images: z.array(z.string()),
    isOpen: z.boolean(),
    acceptsReservations: z.boolean(),
    deliveryPartners: z.array(
        z.enum(['Uber Eats', 'DoorDash', 'Grubhub', 'Postmates'])
    ),
    averageWaitTime: z.number().int(),
    establishedYear: z.number().int(),
});

const MenuItemSchema = z.object({
    id: z.string(),
    restaurantId: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.enum([
        'Appetizers',
        'Main Course',
        'Desserts',
        'Beverages',
        'Soups',
        'Salads',
        'Sides',
        'Specials',
    ]),
    price: z.number(),
    currency: z.string(),
    image: z.string(),
    ingredients: z.array(z.string()),
    allergens: z.array(z.string()),
    dietaryInfo: z.array(z.string()),
    calories: z.number().int(),
    preparationTime: z.number().int(),
    spicyLevel: z.number().int().min(0).max(5),
    isAvailable: z.boolean(),
    isPopular: z.boolean(),
    isNewItem: z.boolean(),
    rating: z.number(),
    reviewCount: z.number().int(),
    customizations: z.array(
        z.object({
            name: z.enum(['Size', 'Spice Level', 'Add-ons', 'Sauce']),
            options: z.array(
                z.object({
                    name: z.string(),
                    priceModifier: z.number(),
                })
            ),
        })
    ),
    nutritionInfo: z.object({
        protein: z.number().int(),
        carbs: z.number().int(),
        fat: z.number().int(),
        fiber: z.number().int(),
        sodium: z.number().int(),
    }),
});

const FoodOrderItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int(),
    subtotal: z.number(),
    specialInstructions: z.string().nullable(),
    customizations: z.array(z.string()),
});

const FoodOrderDeliveryAddressSchema = AddressSchema.omit({ country: true }).extend({
    instructions: z.string().nullable(),
});

const FoodOrderSchema = z.object({
    id: z.string(),
    orderNumber: z.string(),
    status: z.enum([
        'pending',
        'confirmed',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'cancelled',
    ]),
    type: z.enum(['delivery', 'pickup', 'dine_in']),
    restaurant: z.object({
        id: z.string(),
        name: z.string(),
        address: z.string(),
        phone: z.string(),
    }),
    customer: ContactRefSchema.extend({ phone: z.string() }),
    deliveryAddress: FoodOrderDeliveryAddressSchema,
    items: z.array(FoodOrderItemSchema),
    subtotal: z.number(),
    deliveryFee: z.number(),
    tax: z.number(),
    tip: z.number(),
    total: z.number(),
    paymentMethod: z.enum([
        'credit_card',
        'debit_card',
        'cash',
        'apple_pay',
        'google_pay',
    ]),
    isPaid: z.boolean(),
    estimatedDeliveryTime: z.string(),
    actualDeliveryTime: z.string().nullable(),
    driver: z
        .object({
            id: z.string(),
            name: z.string(),
            phone: z.string(),
            vehicle: z.string(),
            rating: z.number(),
        })
        .nullable(),
    rating: z.number().int().nullable(),
    review: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

module.exports = {
    RestaurantHoursSchema,
    RestaurantSchema,
    MenuItemSchema,
    FoodOrderItemSchema,
    FoodOrderDeliveryAddressSchema,
    FoodOrderSchema,
};
