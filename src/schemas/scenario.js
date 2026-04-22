const { z } = require('zod');
const { UserSchema } = require('./user');
const { ProductSchema, ReviewSchema } = require('./ecommerce');
const { AddressSchema, DateLikeSchema } = require('./common');

// Order as produced by generateScenario — has userId (unlike plain generateOrder),
// products are real catalog entries, shippingAddress is the user's address.
const ScenarioOrderSchema = z.object({
    id: z.string(),
    userId: z.string(),
    customerName: z.string(),
    orderDate: DateLikeSchema,
    products: z.array(ProductSchema),
    totalAmount: z.number(),
    shippingAddress: AddressSchema,
});

// Reviews from scenarios carry both productId AND userId (plain generateReview
// only has productId).
const ScenarioReviewSchema = ReviewSchema.extend({
    userId: z.string(),
});

const ScenarioSchema = z
    .object({
        users: z.array(UserSchema),
        products: z.array(ProductSchema),
        orders: z.array(ScenarioOrderSchema),
        reviews: z.array(ScenarioReviewSchema),
    })
    .superRefine((scenario, ctx) => {
        // FK integrity — a runtime contract, not just shape.
        const userIds = new Set(scenario.users.map((u) => u.id));
        const productIds = new Set(scenario.products.map((p) => p.id));

        scenario.orders.forEach((order, idx) => {
            if (!userIds.has(order.userId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['orders', idx, 'userId'],
                    message: `order.userId ${order.userId} does not reference any generated user`,
                });
            }
            order.products.forEach((p, pIdx) => {
                if (!productIds.has(p.id)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: ['orders', idx, 'products', pIdx, 'id'],
                        message: `order product ${p.id} is not in the shared catalog`,
                    });
                }
            });
        });

        scenario.reviews.forEach((review, idx) => {
            if (!userIds.has(review.userId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['reviews', idx, 'userId'],
                    message: `review.userId ${review.userId} does not reference any generated user`,
                });
            }
            if (!productIds.has(review.productId)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['reviews', idx, 'productId'],
                    message: `review.productId ${review.productId} is not in the shared catalog`,
                });
            }
        });
    });

module.exports = {
    ScenarioOrderSchema,
    ScenarioReviewSchema,
    ScenarioSchema,
};
