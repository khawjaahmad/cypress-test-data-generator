const { z } = require('zod');
const { AddressSchema } = require('./common');

const UserSchema = z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    age: z.number().int(),
    address: AddressSchema,
});

const FullAddressSchema = AddressSchema.extend({
    id: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    isDefault: z.boolean(),
});

module.exports = {
    UserSchema,
    FullAddressSchema,
};
