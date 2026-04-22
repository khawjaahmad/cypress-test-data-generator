const { z } = require('zod');
const { AddressSchema, DateLikeSchema } = require('./common');

const ProductSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        category: z.string(),
        inStock: z.boolean(),
        image: z.string(),
        sku: z.string(),
        relatedProducts: z.array(z.lazy(() => ProductSchema)),
    })
    .passthrough();

const ProductWithRelationsSchema = ProductSchema.extend({
    relatedProducts: z.array(
        ProductSchema.extend({ relatedToProductId: z.string() })
    ),
});

const OrderSchema = z.object({
    id: z.string(),
    customerName: z.string(),
    orderDate: DateLikeSchema,
    products: z.array(ProductSchema),
    totalAmount: z.number(),
    shippingAddress: AddressSchema,
});

const ReviewSchema = z.object({
    id: z.string(),
    productId: z.string(),
    rating: z.number().int().min(1).max(5),
    comment: z.string(),
    reviewerName: z.string(),
    reviewDate: z.string(),
    helpful: z.number().int(),
    verified: z.boolean(),
});

const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    parentId: z.string().nullable(),
    slug: z.string(),
    isActive: z.boolean(),
});

const InventorySchema = z.object({
    productId: z.string(),
    quantity: z.number().int(),
    lastUpdated: DateLikeSchema,
    warehouseLocation: z.string(),
    reorderPoint: z.number().int(),
});

const CouponSchema = z.object({
    code: z.string(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number(),
    expirationDate: DateLikeSchema,
    minPurchaseAmount: z.number(),
    isActive: z.boolean(),
});

const ShippingMethodSchema = z.object({
    id: z.string(),
    name: z.enum(['Standard', 'Express', 'Overnight', 'Economy', 'Priority']),
    price: z.number(),
    estimatedDeliveryDays: z.number().int(),
    provider: z.string(),
    isAvailable: z.boolean(),
});

const PaymentMethodSchema = z.object({
    id: z.string(),
    type: z.enum([
        'Credit Card',
        'Debit Card',
        'PayPal',
        'Bank Transfer',
        'Cash on Delivery',
        'Apple Pay',
        'Google Pay',
    ]),
    name: z.string(),
    isDefault: z.boolean(),
    lastFour: z.string(),
    expiryDate: DateLikeSchema,
});

const CartItemSchema = z.object({
    id: z.string(),
    productId: z.string(),
    productName: z.string(),
    productImage: z.string(),
    price: z.number(),
    quantity: z.number().int(),
    subtotal: z.number(),
    variant: z
        .object({
            size: z.enum(['XS', 'S', 'M', 'L', 'XL']),
            color: z.string(),
        })
        .nullable(),
});

const CartSchema = z.object({
    id: z.string(),
    userId: z.string(),
    items: z.array(CartItemSchema),
    itemCount: z.number().int(),
    subtotal: z.number(),
    tax: z.number(),
    discount: z.number(),
    total: z.number(),
    couponCode: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
    expiresAt: z.string(),
});

const WishlistItemSchema = z.object({
    id: z.string(),
    productId: z.string(),
    productName: z.string(),
    productImage: z.string(),
    price: z.number(),
    originalPrice: z.number(),
    inStock: z.boolean(),
    addedAt: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
    notes: z.string().nullable(),
});

const WishlistSchema = z.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    isPublic: z.boolean(),
    items: z.array(WishlistItemSchema),
    totalItems: z.number().int(),
    totalValue: z.number(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const ReturnItemSchema = z.object({
    productId: z.string(),
    productName: z.string(),
    quantity: z.number().int(),
    price: z.number(),
});

const ReturnSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    customerId: z.string(),
    status: z.enum([
        'pending',
        'approved',
        'rejected',
        'processing',
        'completed',
        'cancelled',
    ]),
    reason: z.string(),
    description: z.string(),
    items: z.array(ReturnItemSchema),
    refundAmount: z.number(),
    refundMethod: z.enum(['original_payment', 'store_credit', 'bank_transfer']),
    returnShippingLabel: z.string().nullable(),
    trackingNumber: z.string().nullable(),
    photos: z.array(z.string()),
    requestedAt: z.string(),
    processedAt: z.string().nullable(),
    completedAt: z.string().nullable(),
});

module.exports = {
    ProductSchema,
    ProductWithRelationsSchema,
    OrderSchema,
    ReviewSchema,
    CategorySchema,
    InventorySchema,
    CouponSchema,
    ShippingMethodSchema,
    PaymentMethodSchema,
    CartItemSchema,
    CartSchema,
    WishlistItemSchema,
    WishlistSchema,
    ReturnItemSchema,
    ReturnSchema,
};
