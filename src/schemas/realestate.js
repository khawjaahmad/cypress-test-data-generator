const { z } = require('zod');
const { AddressWithCoordinatesSchema } = require('./common');

const PropertyTypeSchema = z.enum([
    'house',
    'apartment',
    'condo',
    'townhouse',
    'land',
    'commercial',
    'industrial',
]);

const PropertySchema = z.object({
    id: z.string(),
    listingId: z.string(),
    type: PropertyTypeSchema,
    status: z.enum(['for_sale', 'for_rent', 'sold', 'pending', 'off_market']),
    title: z.string(),
    description: z.string(),
    address: AddressWithCoordinatesSchema,
    price: z.number().int(),
    currency: z.string(),
    pricePerSqFt: z.number().int(),
    bedrooms: z.number().int(),
    bathrooms: z.number(),
    squareFeet: z.number().int(),
    lotSize: z.number(),
    yearBuilt: z.number().int(),
    features: z.array(z.string()),
    images: z.array(z.string()),
    virtualTourUrl: z.string().nullable(),
    agent: z.object({
        id: z.string(),
        name: z.string(),
        phone: z.string(),
        email: z.string(),
        company: z.string(),
        photo: z.string(),
    }),
    openHouses: z.array(
        z.object({
            date: z.string(),
            startTime: z.enum(['10:00', '11:00', '12:00', '13:00', '14:00']),
            endTime: z.enum(['15:00', '16:00', '17:00', '18:00']),
        })
    ),
    listedDate: z.string(),
    daysOnMarket: z.number().int(),
    views: z.number().int(),
    saves: z.number().int(),
});

module.exports = {
    PropertyTypeSchema,
    PropertySchema,
};
