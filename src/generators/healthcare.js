const { initFaker } = require('../utils/faker-utils');

/**
 * Create healthcare generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} Healthcare generator methods
 */
const createHealthcareGenerators = (applyPlugins) => ({
    /**
     * Generate medical record data
     * @param {Object} options - Generation options
     * @returns {Object} Generated medical record data
     */
    generateMedicalRecord(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        return applyPlugins({
            patientId: f.string.uuid(),
            name: f.person.fullName(),
            dateOfBirth: f.date.birthdate().toISOString().split('T')[0],
            gender: f.person.sex(),
            bloodType: f.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            height: f.number.int({ min: 150, max: 200 }),
            weight: f.number.int({ min: 40, max: 150 }),
            allergies: [f.science.chemicalElement().name, f.science.chemicalElement().name],
            medications: [f.commerce.productName(), f.commerce.productName()],
            diagnoses: [f.lorem.words(3), f.lorem.words(3)],
            treatmentHistory: f.lorem.paragraph(),
            upcomingAppointments: f.date.future().toISOString().split('T')[0],
            primaryCarePhysician: f.person.fullName()
        });
    },

    /**
     * Generate education record data
     * @param {Object} options - Generation options
     * @returns {Object} Generated education data
     */
    generateEducation(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        const startDate = new Date(f.date.past({ years: 6 }));
        const endDate = new Date(f.date.between({ from: startDate, to: new Date() }));

        return applyPlugins({
            id: f.string.uuid(),
            degree: f.helpers.arrayElement(['Bachelor', 'Master', 'PhD', 'Associate', 'Diploma', 'Certificate']),
            fieldOfStudy: f.person.jobArea(),
            university: f.company.name() + ' University',
            graduationYear: endDate.getFullYear(),
            gpa: Number(f.number.float({ min: 2.0, max: 4.0, multipleOf: 0.1 }).toFixed(1)),
            honors: f.helpers.maybe(() => f.helpers.arrayElement(['Cum Laude', 'Magna Cum Laude', 'Summa Cum Laude'])) || null,
            activities: [
                f.lorem.words(3),
                f.lorem.words(3)
            ],
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        });
    }
});

module.exports = createHealthcareGenerators;
