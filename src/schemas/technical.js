const { z } = require('zod');

const ApiResponseSchema = z.object({
    success: z.boolean(),
    statusCode: z.number().int(),
    message: z.string(),
    data: z
        .object({
            id: z.string(),
            createdAt: z.string(),
            updatedAt: z.string(),
        })
        .nullable(),
    error: z
        .object({
            code: z.string(),
            message: z.string(),
            details: z.string().nullable(),
        })
        .nullable(),
    meta: z.object({
        requestId: z.string(),
        timestamp: z.string(),
        version: z.string(),
        rateLimit: z.object({
            limit: z.number().int(),
            remaining: z.number().int(),
            reset: z.string(),
        }),
    }),
    pagination: z
        .object({
            page: z.number().int(),
            pageSize: z.union([
                z.literal(10),
                z.literal(20),
                z.literal(50),
                z.literal(100),
            ]),
            totalItems: z.number().int(),
            totalPages: z.number().int(),
        })
        .nullable(),
});

const LogLevelSchema = z.enum(['debug', 'info', 'warn', 'error', 'fatal']);

const LogEntrySchema = z.object({
    id: z.string(),
    timestamp: z.string(),
    level: LogLevelSchema,
    message: z.string(),
    service: z.enum([
        'api',
        'auth',
        'database',
        'cache',
        'queue',
        'scheduler',
        'webhook',
    ]),
    environment: z.enum(['development', 'staging', 'production']),
    requestId: z.string(),
    userId: z.string().nullable(),
    sessionId: z.string().nullable(),
    ip: z.string(),
    userAgent: z.string(),
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    path: z.string(),
    statusCode: z.number().int(),
    responseTime: z.number().int(),
    metadata: z.object({
        hostname: z.string(),
        pid: z.number().int(),
        memory: z.number().int(),
    }),
    stack: z.string().nullable(),
});

module.exports = {
    ApiResponseSchema,
    LogLevelSchema,
    LogEntrySchema,
};
