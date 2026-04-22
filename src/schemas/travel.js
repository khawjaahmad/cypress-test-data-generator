const { z } = require('zod');

const TravelItinerarySchema = z.object({
    travelerName: z.string(),
    destination: z.string(),
    departureDate: z.string(),
    returnDate: z.string(),
    flightDetails: z.object({
        airline: z.string(),
        flightNumber: z.string(),
        departureTime: z.string(),
        arrivalTime: z.string(),
    }),
    hotelReservation: z.object({
        hotelName: z.string(),
        checkIn: z.string(),
        checkOut: z.string(),
        roomType: z.enum(['Standard', 'Deluxe', 'Suite', 'Penthouse']),
    }),
    carRental: z.object({
        company: z.string(),
        carModel: z.string(),
        pickupLocation: z.string(),
    }),
    plannedActivities: z.array(z.string()),
    travelInsurance: z.object({
        provider: z.string(),
        policyNumber: z.string(),
    }),
    passportNumber: z.string(),
    emergencyContact: z.object({
        name: z.string(),
        phone: z.string(),
        relationship: z.enum(['Spouse', 'Parent', 'Sibling', 'Friend']),
    }),
});

const VehicleSchema = z.object({
    id: z.string(),
    make: z.string(),
    model: z.string(),
    type: z.string(),
    color: z.string(),
    fuelType: z.string(),
    year: z.number().int(),
    mileage: z.number().int(),
    price: z.number().int(),
    vin: z.string(),
    licensePlate: z.string(),
});

module.exports = {
    TravelItinerarySchema,
    VehicleSchema,
};
