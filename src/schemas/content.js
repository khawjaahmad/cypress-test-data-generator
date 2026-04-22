const { z } = require('zod');
const { CoordinatesSchema, ContactRefSchema } = require('./common');

const BlogPostSchema = z.object({
    id: z.string(),
    slug: z.string(),
    title: z.string(),
    excerpt: z.string(),
    content: z.string(),
    featuredImage: z.string(),
    status: z.enum(['draft', 'published', 'scheduled', 'archived']),
    author: z.object({
        id: z.string(),
        name: z.string(),
        avatar: z.string(),
        bio: z.string(),
    }),
    category: z.enum([
        'Technology',
        'Business',
        'Lifestyle',
        'Travel',
        'Food',
        'Health',
        'Finance',
    ]),
    tags: z.array(z.string()),
    readingTime: z.number().int(),
    views: z.number().int(),
    likes: z.number().int(),
    commentsCount: z.number().int(),
    isFeatured: z.boolean(),
    allowComments: z.boolean(),
    seo: z.object({
        metaTitle: z.string(),
        metaDescription: z.string(),
        keywords: z.array(z.string()),
    }),
    publishedAt: z.string(),
    updatedAt: z.string(),
});

const EventTicketSchema = z.object({
    id: z.string(),
    name: z.enum(['General Admission', 'VIP', 'Early Bird', 'Student']),
    price: z.number(),
    currency: z.string(),
    available: z.number().int(),
});

const EventSpeakerSchema = z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(),
    avatar: z.string(),
    bio: z.string(),
});

const EventSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.enum([
        'conference',
        'workshop',
        'meetup',
        'webinar',
        'concert',
        'festival',
        'networking',
        'exhibition',
    ]),
    status: z.enum(['draft', 'published', 'cancelled', 'postponed', 'completed']),
    startDate: z.string(),
    endDate: z.string(),
    timezone: z.string(),
    venue: z.object({
        name: z.string(),
        address: z.string(),
        city: z.string(),
        country: z.string(),
        coordinates: CoordinatesSchema,
    }),
    isVirtual: z.boolean(),
    virtualUrl: z.string().nullable(),
    coverImage: z.string(),
    organizer: ContactRefSchema.extend({ logo: z.string() }),
    speakers: z.array(EventSpeakerSchema),
    tickets: z.array(EventTicketSchema),
    capacity: z.number().int(),
    registrations: z.number().int(),
    categories: z.array(z.string()),
    isFree: z.boolean(),
    registrationDeadline: z.string(),
});

module.exports = {
    BlogPostSchema,
    EventTicketSchema,
    EventSpeakerSchema,
    EventSchema,
};
