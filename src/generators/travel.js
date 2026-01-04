const { initFaker } = require('../utils/faker-utils');

/**
 * Create travel generators
 * @param {Function} applyPlugins - Plugin application function
 * @returns {Object} Travel generator methods
 */
const createTravelGenerators = (applyPlugins) => ({
    /**
     * Generate travel itinerary data
     * @param {Object} options - Generation options
     * @returns {Object} Generated travel itinerary data
     */
    generateTravelItinerary(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        const departureDate = f.date.future();
        const tripDays = f.number.int({ min: 3, max: 14 });
        const returnDate = new Date(departureDate.getTime() + tripDays * 24 * 60 * 60 * 1000);

        return applyPlugins({
            travelerName: f.person.fullName(),
            destination: f.location.country(),
            departureDate: departureDate.toISOString().split('T')[0],
            returnDate: returnDate.toISOString().split('T')[0],
            flightDetails: {
                airline: f.airline.airline().name,
                flightNumber: f.airline.flightNumber({ length: 6 }),
                departureTime: f.date.soon({ refDate: departureDate, days: 1 }).toISOString().split('.')[0] + 'Z',
                arrivalTime: f.date.soon({ refDate: departureDate, days: 1 }).toISOString().split('.')[0] + 'Z'
            },
            hotelReservation: {
                hotelName: f.company.name() + ' Hotel',
                checkIn: departureDate.toISOString().split('T')[0],
                checkOut: returnDate.toISOString().split('T')[0],
                roomType: f.helpers.arrayElement(['Standard', 'Deluxe', 'Suite', 'Penthouse'])
            },
            carRental: {
                company: f.company.name(),
                carModel: f.vehicle.model(),
                pickupLocation: f.location.city() + ' Airport'
            },
            plannedActivities: [
                f.lorem.sentence(),
                f.lorem.sentence(),
                f.lorem.sentence()
            ],
            travelInsurance: {
                provider: f.company.name(),
                policyNumber: f.finance.accountNumber()
            },
            passportNumber: f.string.alphanumeric(9).toUpperCase(),
            emergencyContact: {
                name: f.person.fullName(),
                phone: f.phone.number(),
                relationship: f.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend'])
            }
        });
    },

    /**
     * Generate vehicle data
     * @param {Object} options - Generation options
     * @returns {Object} Generated vehicle data
     */
    generateVehicle(options = {}) {
        const { seed, locale } = options || {};
        const f = initFaker({ seed, locale });

        return applyPlugins({
            id: f.string.uuid(),
            make: f.vehicle.manufacturer(),
            model: f.vehicle.model(),
            type: f.vehicle.type(),
            color: f.vehicle.color(),
            fuelType: f.vehicle.fuel(),
            year: f.date.past({ years: 20 }).getFullYear(),
            mileage: f.number.int({ min: 0, max: 200000 }),
            price: f.number.int({ min: 1000, max: 100000 }),
            vin: f.vehicle.vin(),
            licensePlate: f.vehicle.vrm()
        });
    }
});

module.exports = createTravelGenerators;
