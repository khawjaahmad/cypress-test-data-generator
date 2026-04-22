const { z } = require('zod');

const AddressSchema = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
});

const CoordinatesSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

const AddressWithCoordinatesSchema = AddressSchema.extend({
    coordinates: CoordinatesSchema,
});

const PersonRefSchema = z.object({
    id: z.string(),
    name: z.string(),
});

const ContactRefSchema = PersonRefSchema.extend({
    email: z.string(),
});

// Date-like: generators return Date objects, but JSON round-trips
// (e.g. cy.task) turn them into ISO strings. Schemas accept both so
// validation is transport-agnostic.
const DateLikeSchema = z.union([z.date(), z.string()]);

module.exports = {
    AddressSchema,
    CoordinatesSchema,
    AddressWithCoordinatesSchema,
    PersonRefSchema,
    ContactRefSchema,
    DateLikeSchema,
};
