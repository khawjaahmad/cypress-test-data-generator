const { z } = require('zod');

const MedicalRecordSchema = z.object({
    patientId: z.string(),
    name: z.string(),
    dateOfBirth: z.string(),
    gender: z.enum(['female', 'male']),
    bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    height: z.number().int(),
    weight: z.number().int(),
    allergies: z.array(z.string()),
    medications: z.array(z.string()),
    diagnoses: z.array(z.string()),
    treatmentHistory: z.string(),
    upcomingAppointments: z.string(),
    primaryCarePhysician: z.string(),
});

const EducationSchema = z.object({
    id: z.string(),
    degree: z.enum([
        'Bachelor',
        'Master',
        'PhD',
        'Associate',
        'Diploma',
        'Certificate',
    ]),
    fieldOfStudy: z.string(),
    university: z.string(),
    graduationYear: z.number().int(),
    gpa: z.number(),
    honors: z.enum(['Cum Laude', 'Magna Cum Laude', 'Summa Cum Laude']).nullable(),
    activities: z.array(z.string()),
    startDate: z.string(),
    endDate: z.string(),
});

module.exports = {
    MedicalRecordSchema,
    EducationSchema,
};
