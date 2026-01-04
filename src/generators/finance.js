const { initFaker } = require('../utils/faker-utils');

/**
 * Create finance generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} Finance generator methods
 */
const createFinanceGenerators = (applyPlugins) => ({
    /**
     * Generate credit card data
     * @param {Object} options - Generation options
     * @returns {Object} Generated credit card data
     */
    generateCreditCard(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        return applyPlugins({
            id: f.string.uuid(),
            cardNumber: f.finance.creditCardNumber(),
            cardHolder: f.person.fullName(),
            expiryDate: f.date.future().toISOString().split('T')[0],
            cvv: f.finance.creditCardCVV(),
            cardType: f.finance.creditCardIssuer(),
            isDefault: f.datatype.boolean()
        });
    },

    /**
     * Generate transaction data
     * @param {Object} options - Generation options
     * @returns {Object} Generated transaction data
     */
    generateTransaction(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        return applyPlugins({
            id: f.string.uuid(),
            amount: parseFloat(f.finance.amount({ min: 1, max: 10000 })),
            currency: f.finance.currencyCode(),
            type: f.helpers.arrayElement(['purchase', 'refund', 'transfer', 'withdrawal', 'deposit']),
            status: f.helpers.arrayElement(['pending', 'completed', 'failed', 'cancelled']),
            date: f.date.recent({ days: 30 }).toISOString(),
            description: f.finance.transactionDescription(),
            accountNumber: f.finance.accountNumber()
        });
    },

    /**
     * Generate bank account data
     * @param {Object} options - Generation options
     * @returns {Object} Generated bank account data
     */
    generateBankAccount(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        return applyPlugins({
            id: f.string.uuid(),
            accountNumber: f.finance.accountNumber(12),
            routingNumber: f.finance.routingNumber(),
            iban: f.finance.iban(),
            bic: f.finance.bic(),
            accountType: f.helpers.arrayElement(['checking', 'savings', 'money_market', 'cd', 'ira']),
            accountName: f.finance.accountName(),
            balance: parseFloat(f.finance.amount({ min: 0, max: 100000 })),
            availableBalance: parseFloat(f.finance.amount({ min: 0, max: 50000 })),
            currency: f.finance.currencyCode(),
            status: f.helpers.arrayElement(['active', 'frozen', 'closed', 'pending']),
            owner: {
                id: f.string.uuid(),
                name: f.person.fullName(),
                email: f.internet.email()
            },
            bank: {
                name: f.company.name() + ' Bank',
                branch: f.location.city() + ' Branch',
                address: f.location.streetAddress()
            },
            openedDate: f.date.past({ years: 10 }).toISOString().split('T')[0],
            lastActivityDate: f.date.recent({ days: 30 }).toISOString(),
            interestRate: f.number.float({ min: 0.01, max: 5, multipleOf: 0.01 }),
            overdraftLimit: f.number.int({ min: 0, max: 5000 }),
            isJointAccount: f.datatype.boolean()
        });
    },

    /**
     * Generate loan data
     * @param {Object} options - Generation options
     * @returns {Object} Generated loan data
     */
    generateLoan(options = {}) {
        const { seed, locale, type = null } = options || {};
        const f = initFaker({ seed, locale });

        const loanTypes = ['personal', 'mortgage', 'auto', 'student', 'business', 'home_equity'];
        const startDate = f.date.past({ years: 5 });

        return applyPlugins({
            id: f.string.uuid(),
            loanNumber: `LN-${f.string.numeric(10)}`,
            type: type || f.helpers.arrayElement(loanTypes),
            status: f.helpers.arrayElement(['pending', 'approved', 'active', 'paid_off', 'defaulted', 'cancelled']),
            borrower: {
                id: f.string.uuid(),
                name: f.person.fullName(),
                email: f.internet.email(),
                creditScore: f.number.int({ min: 300, max: 850 })
            },
            principal: f.number.int({ min: 1000, max: 500000 }),
            interestRate: f.number.float({ min: 2, max: 20, multipleOf: 0.01 }),
            term: f.helpers.arrayElement([12, 24, 36, 48, 60, 120, 180, 240, 360]),
            monthlyPayment: parseFloat(f.finance.amount({ min: 100, max: 5000 })),
            totalInterest: parseFloat(f.finance.amount({ min: 500, max: 100000 })),
            totalPayable: parseFloat(f.finance.amount({ min: 1500, max: 600000 })),
            remainingBalance: parseFloat(f.finance.amount({ min: 0, max: 500000 })),
            currency: f.finance.currencyCode(),
            startDate: startDate.toISOString().split('T')[0],
            endDate: f.date.future({ years: 30 }).toISOString().split('T')[0],
            nextPaymentDate: f.date.future({ years: 0.1 }).toISOString().split('T')[0],
            paymentsMade: f.number.int({ min: 0, max: 360 }),
            paymentsRemaining: f.number.int({ min: 0, max: 360 }),
            collateral: f.helpers.maybe(() => ({
                type: f.helpers.arrayElement(['property', 'vehicle', 'savings', 'investment']),
                value: f.number.int({ min: 5000, max: 1000000 }),
                description: f.lorem.sentence()
            })) || null,
            lender: {
                name: f.company.name() + ' Financial',
                contactEmail: f.internet.email()
            }
        });
    },

    /**
     * Generate insurance policy data
     * @param {Object} options - Generation options
     * @returns {Object} Generated insurance policy data
     */
    generateInsurancePolicy(options = {}) {
        const { seed, locale, type = null } = options || {};
        const f = initFaker({ seed, locale });

        const policyTypes = ['health', 'auto', 'home', 'life', 'travel', 'pet', 'business', 'disability'];
        const startDate = f.date.past({ years: 2 });

        return applyPlugins({
            id: f.string.uuid(),
            policyNumber: `POL-${f.string.alphanumeric(10).toUpperCase()}`,
            type: type || f.helpers.arrayElement(policyTypes),
            status: f.helpers.arrayElement(['active', 'expired', 'cancelled', 'pending', 'suspended']),
            policyholder: {
                id: f.string.uuid(),
                name: f.person.fullName(),
                email: f.internet.email(),
                phone: f.phone.number(),
                dateOfBirth: f.date.birthdate().toISOString().split('T')[0]
            },
            coverage: {
                amount: f.number.int({ min: 10000, max: 1000000 }),
                deductible: f.number.int({ min: 250, max: 5000 }),
                currency: f.finance.currencyCode()
            },
            premium: {
                amount: parseFloat(f.finance.amount({ min: 50, max: 1000 })),
                frequency: f.helpers.arrayElement(['monthly', 'quarterly', 'semi-annually', 'annually']),
                nextDueDate: f.date.future({ years: 0.25 }).toISOString().split('T')[0]
            },
            effectiveDate: startDate.toISOString().split('T')[0],
            expirationDate: f.date.future({ years: 1, refDate: startDate }).toISOString().split('T')[0],
            beneficiaries: Array.from({ length: f.number.int({ min: 1, max: 3 }) }, () => ({
                name: f.person.fullName(),
                relationship: f.helpers.arrayElement(['Spouse', 'Child', 'Parent', 'Sibling', 'Other']),
                percentage: f.number.int({ min: 10, max: 100 })
            })),
            insurer: {
                name: f.company.name() + ' Insurance',
                contactNumber: f.phone.number(),
                claimsEmail: f.internet.email()
            },
            claims: Array.from({ length: f.number.int({ min: 0, max: 3 }) }, () => ({
                id: f.string.uuid(),
                date: f.date.past({ years: 1 }).toISOString().split('T')[0],
                amount: parseFloat(f.finance.amount({ min: 100, max: 50000 })),
                status: f.helpers.arrayElement(['pending', 'approved', 'denied', 'paid']),
                description: f.lorem.sentence()
            })),
            autoRenewal: f.datatype.boolean()
        });
    },

    /**
     * Generate subscription data
     * @param {Object} options - Generation options
     * @returns {Object} Generated subscription data
     */
    generateSubscription(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        const startDate = f.date.past({ years: 2 });

        return applyPlugins({
            id: f.string.uuid(),
            planName: f.helpers.arrayElement(['Basic', 'Standard', 'Premium', 'Enterprise']),
            price: parseFloat(f.commerce.price({ min: 5, max: 100 })),
            billingCycle: f.helpers.arrayElement(['monthly', 'quarterly', 'yearly']),
            status: f.helpers.arrayElement(['active', 'cancelled', 'paused', 'expired']),
            startDate: startDate.toISOString().split('T')[0],
            nextBillingDate: f.date.future().toISOString().split('T')[0],
            features: [
                f.lorem.words(3),
                f.lorem.words(3),
                f.lorem.words(3)
            ],
            autoRenew: f.datatype.boolean()
        });
    }
});

module.exports = createFinanceGenerators;
