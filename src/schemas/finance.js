const { z } = require('zod');
const { ContactRefSchema } = require('./common');

const CreditCardSchema = z.object({
    id: z.string(),
    cardNumber: z.string(),
    cardHolder: z.string(),
    expiryDate: z.string(),
    cvv: z.string(),
    cardType: z.string(),
    isDefault: z.boolean(),
});

const TransactionSchema = z.object({
    id: z.string(),
    amount: z.number(),
    currency: z.string(),
    type: z.enum(['purchase', 'refund', 'transfer', 'withdrawal', 'deposit']),
    status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
    date: z.string(),
    description: z.string(),
    accountNumber: z.string(),
});

const BankAccountSchema = z.object({
    id: z.string(),
    accountNumber: z.string(),
    routingNumber: z.string(),
    iban: z.string(),
    bic: z.string(),
    accountType: z.enum(['checking', 'savings', 'money_market', 'cd', 'ira']),
    accountName: z.string(),
    balance: z.number(),
    availableBalance: z.number(),
    currency: z.string(),
    status: z.enum(['active', 'frozen', 'closed', 'pending']),
    owner: ContactRefSchema,
    bank: z.object({
        name: z.string(),
        branch: z.string(),
        address: z.string(),
    }),
    openedDate: z.string(),
    lastActivityDate: z.string(),
    interestRate: z.number(),
    overdraftLimit: z.number().int(),
    isJointAccount: z.boolean(),
});

const LoanTypeSchema = z.enum([
    'personal',
    'mortgage',
    'auto',
    'student',
    'business',
    'home_equity',
]);

const LoanSchema = z.object({
    id: z.string(),
    loanNumber: z.string(),
    type: LoanTypeSchema,
    status: z.enum([
        'pending',
        'approved',
        'active',
        'paid_off',
        'defaulted',
        'cancelled',
    ]),
    borrower: ContactRefSchema.extend({ creditScore: z.number().int() }),
    principal: z.number().int(),
    interestRate: z.number(),
    term: z.union([
        z.literal(12),
        z.literal(24),
        z.literal(36),
        z.literal(48),
        z.literal(60),
        z.literal(120),
        z.literal(180),
        z.literal(240),
        z.literal(360),
    ]),
    monthlyPayment: z.number(),
    totalInterest: z.number(),
    totalPayable: z.number(),
    remainingBalance: z.number(),
    currency: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    nextPaymentDate: z.string(),
    paymentsMade: z.number().int(),
    paymentsRemaining: z.number().int(),
    collateral: z
        .object({
            type: z.enum(['property', 'vehicle', 'savings', 'investment']),
            value: z.number().int(),
            description: z.string(),
        })
        .nullable(),
    lender: z.object({
        name: z.string(),
        contactEmail: z.string(),
    }),
});

const InsurancePolicyTypeSchema = z.enum([
    'health',
    'auto',
    'home',
    'life',
    'travel',
    'pet',
    'business',
    'disability',
]);

const InsurancePolicySchema = z.object({
    id: z.string(),
    policyNumber: z.string(),
    type: InsurancePolicyTypeSchema,
    status: z.enum(['active', 'expired', 'cancelled', 'pending', 'suspended']),
    policyholder: ContactRefSchema.extend({
        phone: z.string(),
        dateOfBirth: z.string(),
    }),
    coverage: z.object({
        amount: z.number().int(),
        deductible: z.number().int(),
        currency: z.string(),
    }),
    premium: z.object({
        amount: z.number(),
        frequency: z.enum(['monthly', 'quarterly', 'semi-annually', 'annually']),
        nextDueDate: z.string(),
    }),
    effectiveDate: z.string(),
    expirationDate: z.string(),
    beneficiaries: z.array(
        z.object({
            name: z.string(),
            relationship: z.enum(['Spouse', 'Child', 'Parent', 'Sibling', 'Other']),
            percentage: z.number().int(),
        })
    ),
    insurer: z.object({
        name: z.string(),
        contactNumber: z.string(),
        claimsEmail: z.string(),
    }),
    claims: z.array(
        z.object({
            id: z.string(),
            date: z.string(),
            amount: z.number(),
            status: z.enum(['pending', 'approved', 'denied', 'paid']),
            description: z.string(),
        })
    ),
    autoRenewal: z.boolean(),
});

const SubscriptionSchema = z.object({
    id: z.string(),
    planName: z.enum(['Basic', 'Standard', 'Premium', 'Enterprise']),
    price: z.number(),
    billingCycle: z.enum(['monthly', 'quarterly', 'yearly']),
    status: z.enum(['active', 'cancelled', 'paused', 'expired']),
    startDate: z.string(),
    nextBillingDate: z.string(),
    features: z.array(z.string()),
    autoRenew: z.boolean(),
});

module.exports = {
    CreditCardSchema,
    TransactionSchema,
    BankAccountSchema,
    LoanTypeSchema,
    LoanSchema,
    InsurancePolicyTypeSchema,
    InsurancePolicySchema,
    SubscriptionSchema,
};
