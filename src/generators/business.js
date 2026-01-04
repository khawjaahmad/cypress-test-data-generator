const { initFaker } = require('../utils/faker-utils');

/**
 * Create business/enterprise generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} Business generator methods
 */
const createBusinessGenerators = (applyPlugins) => ({
    /**
     * Generate company data
     * @param {Object} options - Generation options
     * @returns {Object} Generated company data
     */
    generateCompany(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        return applyPlugins({
            id: f.string.uuid(),
            name: f.company.name(),
            industry: f.company.buzzNoun(),
            foundedYear: f.date.past({ years: 100 }).getFullYear(),
            employees: f.number.int({ min: 1, max: 100000 }),
            revenue: f.finance.amount({ min: 10000, max: 1000000000, dec: 0 }),
            headquarters: f.location.city(),
            ceo: f.person.fullName(),
            description: f.company.catchPhrase(),
            stockSymbol: f.string.alpha({ length: 4, casing: 'upper' }),
            website: f.internet.url()
        });
    },

    /**
     * Generate invoice data
     * @param {Object} options - Generation options
     * @returns {Object} Generated invoice data
     */
    generateInvoice(options = {}) {
        const { seed, locale, itemCount = 3 } = options || {};
        const f = initFaker({ seed, locale });

        const items = Array.from({ length: Math.max(1, itemCount) }, () => {
            const quantity = f.number.int({ min: 1, max: 10 });
            const unitPrice = parseFloat(f.commerce.price({ min: 10, max: 1000 }));
            return {
                id: f.string.uuid(),
                description: f.commerce.productName(),
                quantity,
                unitPrice,
                total: parseFloat((quantity * unitPrice).toFixed(2))
            };
        });

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const taxRate = 0.1;
        const tax = parseFloat((subtotal * taxRate).toFixed(2));
        const discount = parseFloat(f.commerce.price({ min: 0, max: 50 }));

        return applyPlugins({
            id: f.string.uuid(),
            invoiceNumber: `INV-${f.string.numeric(6)}`,
            status: f.helpers.arrayElement(['draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded']),
            issueDate: f.date.recent({ days: 30 }).toISOString().split('T')[0],
            dueDate: f.date.future({ years: 0.1 }).toISOString().split('T')[0],
            client: {
                id: f.string.uuid(),
                name: f.company.name(),
                email: f.internet.email(),
                address: {
                    street: f.location.streetAddress(),
                    city: f.location.city(),
                    state: f.location.state(),
                    zipCode: f.location.zipCode(),
                    country: f.location.country()
                }
            },
            items,
            subtotal: parseFloat(subtotal.toFixed(2)),
            taxRate: taxRate * 100,
            tax,
            discount,
            total: parseFloat((subtotal + tax - discount).toFixed(2)),
            currency: f.finance.currencyCode(),
            notes: f.helpers.maybe(() => f.lorem.sentence()) || null,
            paymentTerms: f.helpers.arrayElement(['Net 15', 'Net 30', 'Net 60', 'Due on receipt']),
            paymentMethod: f.helpers.maybe(() => f.helpers.arrayElement(['bank_transfer', 'credit_card', 'paypal', 'check'])) || null
        });
    },

    /**
     * Generate employee data
     * @param {Object} options - Generation options
     * @returns {Object} Generated employee data
     */
    generateEmployee(options = {}) {
        const { seed, locale, department = null } = options || {};
        const f = initFaker({ seed, locale });

        const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Product', 'Design', 'Support'];
        const hireDate = f.date.past({ years: 10 });

        return applyPlugins({
            id: f.string.uuid(),
            employeeId: `EMP-${f.string.numeric(6)}`,
            firstName: f.person.firstName(),
            lastName: f.person.lastName(),
            email: f.internet.email(),
            phone: f.phone.number(),
            avatar: f.image.avatar(),
            department: department || f.helpers.arrayElement(departments),
            jobTitle: f.person.jobTitle(),
            employmentType: f.helpers.arrayElement(['full-time', 'part-time', 'contract', 'intern']),
            status: f.helpers.arrayElement(['active', 'on_leave', 'terminated', 'suspended']),
            manager: f.helpers.maybe(() => ({
                id: f.string.uuid(),
                name: f.person.fullName()
            })) || null,
            salary: {
                amount: f.number.int({ min: 30000, max: 200000 }),
                currency: f.finance.currencyCode(),
                frequency: 'yearly'
            },
            hireDate: hireDate.toISOString().split('T')[0],
            terminationDate: f.helpers.maybe(() => f.date.future().toISOString().split('T')[0]) || null,
            workLocation: f.helpers.arrayElement(['office', 'remote', 'hybrid']),
            office: {
                building: f.location.buildingNumber(),
                floor: f.number.int({ min: 1, max: 50 }),
                desk: f.string.alphanumeric(4).toUpperCase()
            },
            skills: Array.from({ length: f.number.int({ min: 2, max: 6 }) }, () => f.person.jobArea()),
            emergencyContact: {
                name: f.person.fullName(),
                relationship: f.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
                phone: f.phone.number()
            }
        });
    },

    /**
     * Generate project data
     * @param {Object} options - Generation options
     * @returns {Object} Generated project data
     */
    generateProject(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        const startDate = f.date.past({ years: 1 });
        const endDate = f.date.future({ years: 1 });

        return applyPlugins({
            id: f.string.uuid(),
            name: f.company.catchPhrase(),
            code: f.string.alpha({ length: 3, casing: 'upper' }) + '-' + f.string.numeric(4),
            description: f.lorem.paragraphs(2),
            status: f.helpers.arrayElement(['planning', 'in_progress', 'on_hold', 'completed', 'cancelled']),
            priority: f.helpers.arrayElement(['low', 'medium', 'high', 'critical']),
            category: f.helpers.arrayElement(['Development', 'Marketing', 'Research', 'Infrastructure', 'Support']),
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            budget: {
                allocated: f.number.int({ min: 10000, max: 1000000 }),
                spent: f.number.int({ min: 0, max: 500000 }),
                currency: f.finance.currencyCode()
            },
            progress: f.number.int({ min: 0, max: 100 }),
            owner: {
                id: f.string.uuid(),
                name: f.person.fullName(),
                email: f.internet.email()
            },
            team: Array.from({ length: f.number.int({ min: 2, max: 8 }) }, () => ({
                id: f.string.uuid(),
                name: f.person.fullName(),
                role: f.person.jobTitle()
            })),
            milestones: Array.from({ length: f.number.int({ min: 2, max: 5 }) }, () => ({
                id: f.string.uuid(),
                name: f.lorem.words(3),
                dueDate: f.date.between({ from: startDate, to: endDate }).toISOString().split('T')[0],
                completed: f.datatype.boolean()
            })),
            tags: Array.from({ length: f.number.int({ min: 1, max: 4 }) }, () => f.lorem.word()),
            repositoryUrl: f.helpers.maybe(() => f.internet.url()) || null,
            documentationUrl: f.helpers.maybe(() => f.internet.url()) || null
        });
    },

    /**
     * Generate support ticket data
     * @param {Object} options - Generation options
     * @returns {Object} Generated ticket data
     */
    generateTicket(options = {}) {
        const { seed, locale, customerId = null } = options || {};
        const f = initFaker({ seed, locale });

        const categories = ['Technical Support', 'Billing', 'Account', 'Feature Request', 'Bug Report', 'General Inquiry'];

        return applyPlugins({
            id: f.string.uuid(),
            ticketNumber: `TKT-${f.string.numeric(8)}`,
            subject: f.lorem.sentence({ min: 4, max: 10 }),
            description: f.lorem.paragraphs(2),
            status: f.helpers.arrayElement(['open', 'in_progress', 'pending', 'resolved', 'closed']),
            priority: f.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
            category: f.helpers.arrayElement(categories),
            channel: f.helpers.arrayElement(['email', 'phone', 'chat', 'web', 'social']),
            customer: {
                id: customerId || f.string.uuid(),
                name: f.person.fullName(),
                email: f.internet.email()
            },
            assignee: f.helpers.maybe(() => ({
                id: f.string.uuid(),
                name: f.person.fullName(),
                department: 'Support'
            })) || null,
            tags: Array.from({ length: f.number.int({ min: 0, max: 4 }) }, () => f.lorem.word()),
            attachments: Array.from({ length: f.number.int({ min: 0, max: 3 }) }, () => ({
                id: f.string.uuid(),
                filename: f.system.fileName(),
                size: f.number.int({ min: 1000, max: 10000000 }),
                url: f.internet.url()
            })),
            createdAt: f.date.recent({ days: 30 }).toISOString(),
            updatedAt: f.date.recent({ days: 7 }).toISOString(),
            resolvedAt: f.helpers.maybe(() => f.date.recent({ days: 3 }).toISOString()) || null,
            firstResponseTime: f.number.int({ min: 1, max: 1440 }),
            satisfactionRating: f.helpers.maybe(() => f.number.int({ min: 1, max: 5 })) || null
        });
    },

    /**
     * Generate meeting data
     * @param {Object} options - Generation options
     * @returns {Object} Generated meeting data
     */
    generateMeeting(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        const startTime = f.date.future({ years: 0.1 });
        const duration = f.helpers.arrayElement([15, 30, 45, 60, 90, 120]);
        const endTime = new Date(startTime.getTime() + duration * 60 * 1000);

        return applyPlugins({
            id: f.string.uuid(),
            title: f.lorem.sentence({ min: 3, max: 8 }),
            description: f.lorem.paragraph(),
            type: f.helpers.arrayElement(['one_on_one', 'team', 'all_hands', 'interview', 'external', 'training']),
            status: f.helpers.arrayElement(['scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled']),
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            duration,
            timezone: f.location.timeZone(),
            location: f.helpers.arrayElement([
                { type: 'virtual', url: f.internet.url(), platform: f.helpers.arrayElement(['Zoom', 'Google Meet', 'Teams', 'Webex']) },
                { type: 'physical', room: `Room ${f.string.alphanumeric(3).toUpperCase()}`, building: f.location.buildingNumber() }
            ]),
            organizer: {
                id: f.string.uuid(),
                name: f.person.fullName(),
                email: f.internet.email()
            },
            attendees: Array.from({ length: f.number.int({ min: 1, max: 10 }) }, () => ({
                id: f.string.uuid(),
                name: f.person.fullName(),
                email: f.internet.email(),
                status: f.helpers.arrayElement(['accepted', 'declined', 'tentative', 'pending']),
                isOptional: f.datatype.boolean()
            })),
            isRecurring: f.datatype.boolean(),
            recurrence: f.helpers.maybe(() => ({
                frequency: f.helpers.arrayElement(['daily', 'weekly', 'biweekly', 'monthly']),
                until: f.date.future({ years: 1 }).toISOString().split('T')[0]
            })) || null,
            agenda: Array.from({ length: f.number.int({ min: 1, max: 5 }) }, () => f.lorem.sentence()),
            notes: f.helpers.maybe(() => f.lorem.paragraphs(2)) || null,
            recordingUrl: f.helpers.maybe(() => f.internet.url()) || null
        });
    },

    /**
     * Generate job listing data
     * @param {Object} options - Generation options
     * @returns {Object} Generated job listing data
     */
    generateJobListing(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        const postedDate = new Date(f.date.recent({ days: 30 }));
        const applicationDeadline = new Date(f.date.soon({ days: 30, refDate: postedDate }));

        const minSalary = f.number.int({ min: 30000, max: 80000 });

        return applyPlugins({
            id: f.string.uuid(),
            title: f.person.jobTitle(),
            company: f.company.name(),
            location: f.location.city(),
            description: f.lorem.paragraphs(2),
            requirements: [
                f.lorem.sentence(),
                f.lorem.sentence(),
                f.lorem.sentence()
            ],
            salary: {
                min: minSalary,
                max: f.number.int({ min: minSalary + 1000, max: 200000 })
            },
            employmentType: f.helpers.arrayElement(['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Remote']),
            postedDate: postedDate.toISOString().split('.')[0] + 'Z',
            applicationDeadline: applicationDeadline.toISOString().split('.')[0] + 'Z'
        });
    }
});

module.exports = createBusinessGenerators;
