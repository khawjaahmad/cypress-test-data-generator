const { z } = require('zod');
const { AddressSchema, PersonRefSchema, ContactRefSchema } = require('./common');

const CompanySchema = z.object({
    id: z.string(),
    name: z.string(),
    industry: z.string(),
    foundedYear: z.number().int(),
    employees: z.number().int(),
    revenue: z.string(),
    headquarters: z.string(),
    ceo: z.string(),
    description: z.string(),
    stockSymbol: z.string(),
    website: z.string(),
});

const InvoiceItemSchema = z.object({
    id: z.string(),
    description: z.string(),
    quantity: z.number().int(),
    unitPrice: z.number(),
    total: z.number(),
});

const InvoiceClientSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    address: AddressSchema,
});

const InvoiceSchema = z.object({
    id: z.string(),
    invoiceNumber: z.string(),
    status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded']),
    issueDate: z.string(),
    dueDate: z.string(),
    client: InvoiceClientSchema,
    items: z.array(InvoiceItemSchema),
    subtotal: z.number(),
    taxRate: z.number(),
    tax: z.number(),
    discount: z.number(),
    total: z.number(),
    currency: z.string(),
    notes: z.string().nullable(),
    paymentTerms: z.enum(['Net 15', 'Net 30', 'Net 60', 'Due on receipt']),
    paymentMethod: z
        .enum(['bank_transfer', 'credit_card', 'paypal', 'check'])
        .nullable(),
});

const EmployeeSchema = z.object({
    id: z.string(),
    employeeId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    avatar: z.string(),
    department: z.string(),
    jobTitle: z.string(),
    employmentType: z.enum(['full-time', 'part-time', 'contract', 'intern']),
    status: z.enum(['active', 'on_leave', 'terminated', 'suspended']),
    manager: PersonRefSchema.nullable(),
    salary: z.object({
        amount: z.number().int(),
        currency: z.string(),
        frequency: z.literal('yearly'),
    }),
    hireDate: z.string(),
    terminationDate: z.string().nullable(),
    workLocation: z.enum(['office', 'remote', 'hybrid']),
    office: z.object({
        building: z.string(),
        floor: z.number().int(),
        desk: z.string(),
    }),
    skills: z.array(z.string()),
    emergencyContact: z.object({
        name: z.string(),
        relationship: z.string(),
        phone: z.string(),
    }),
});

const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    status: z.enum([
        'planning',
        'in_progress',
        'on_hold',
        'completed',
        'cancelled',
    ]),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    category: z.enum([
        'Development',
        'Marketing',
        'Research',
        'Infrastructure',
        'Support',
    ]),
    startDate: z.string(),
    endDate: z.string(),
    budget: z.object({
        allocated: z.number().int(),
        spent: z.number().int(),
        currency: z.string(),
    }),
    progress: z.number().int().min(0).max(100),
    owner: ContactRefSchema,
    team: z.array(
        z.object({ id: z.string(), name: z.string(), role: z.string() })
    ),
    milestones: z.array(
        z.object({
            id: z.string(),
            name: z.string(),
            dueDate: z.string(),
            completed: z.boolean(),
        })
    ),
    tags: z.array(z.string()),
    repositoryUrl: z.string().nullable(),
    documentationUrl: z.string().nullable(),
});

const TicketSchema = z.object({
    id: z.string(),
    ticketNumber: z.string(),
    subject: z.string(),
    description: z.string(),
    status: z.enum(['open', 'in_progress', 'pending', 'resolved', 'closed']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    category: z.string(),
    channel: z.enum(['email', 'phone', 'chat', 'web', 'social']),
    customer: ContactRefSchema,
    assignee: PersonRefSchema.extend({ department: z.literal('Support') }).nullable(),
    tags: z.array(z.string()),
    attachments: z.array(
        z.object({
            id: z.string(),
            filename: z.string(),
            size: z.number().int(),
            url: z.string(),
        })
    ),
    createdAt: z.string(),
    updatedAt: z.string(),
    resolvedAt: z.string().nullable(),
    firstResponseTime: z.number().int(),
    satisfactionRating: z.number().int().nullable(),
});

const MeetingLocationSchema = z.union([
    z.object({
        type: z.literal('virtual'),
        url: z.string(),
        platform: z.enum(['Zoom', 'Google Meet', 'Teams', 'Webex']),
    }),
    z.object({
        type: z.literal('physical'),
        room: z.string(),
        building: z.string(),
    }),
]);

const MeetingSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    type: z.enum([
        'one_on_one',
        'team',
        'all_hands',
        'interview',
        'external',
        'training',
    ]),
    status: z.enum([
        'scheduled',
        'in_progress',
        'completed',
        'cancelled',
        'rescheduled',
    ]),
    startTime: z.string(),
    endTime: z.string(),
    duration: z.union([
        z.literal(15),
        z.literal(30),
        z.literal(45),
        z.literal(60),
        z.literal(90),
        z.literal(120),
    ]),
    timezone: z.string(),
    location: MeetingLocationSchema,
    organizer: ContactRefSchema,
    attendees: z.array(
        ContactRefSchema.extend({
            status: z.enum(['accepted', 'declined', 'tentative', 'pending']),
            isOptional: z.boolean(),
        })
    ),
    isRecurring: z.boolean(),
    recurrence: z
        .object({
            frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly']),
            until: z.string(),
        })
        .nullable(),
    agenda: z.array(z.string()),
    notes: z.string().nullable(),
    recordingUrl: z.string().nullable(),
});

const JobListingSchema = z.object({
    id: z.string(),
    title: z.string(),
    company: z.string(),
    location: z.string(),
    description: z.string(),
    requirements: z.array(z.string()),
    salary: z.object({
        min: z.number().int(),
        max: z.number().int(),
    }),
    employmentType: z.enum([
        'Full-time',
        'Part-time',
        'Contract',
        'Temporary',
        'Internship',
        'Remote',
    ]),
    postedDate: z.string(),
    applicationDeadline: z.string(),
});

module.exports = {
    CompanySchema,
    InvoiceItemSchema,
    InvoiceClientSchema,
    InvoiceSchema,
    EmployeeSchema,
    ProjectSchema,
    TicketSchema,
    MeetingLocationSchema,
    MeetingSchema,
    JobListingSchema,
};
