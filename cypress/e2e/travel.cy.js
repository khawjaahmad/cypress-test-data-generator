import { expectValidTravelItinerary } from '../support/schemas';

describe('Travel Itinerary Generator', () => {
  context('Basic Generation', () => {
    it('generates valid travel itinerary with default options', () => {
      cy.task('generateTravelItinerary').then(expectValidTravelItinerary);
    });

    it('generates valid flight details structure', () => {
      cy.task('generateTravelItinerary').then((itinerary) => {
        expect(itinerary.flightDetails).to.have.all.keys('airline', 'flightNumber', 'departureTime', 'arrivalTime');
      });
    });

    it('generates valid hotel reservation structure', () => {
      cy.task('generateTravelItinerary').then((itinerary) => {
        expect(itinerary.hotelReservation).to.have.all.keys('hotelName', 'checkIn', 'checkOut', 'roomType');
      });
    });

    it('generates valid car rental structure', () => {
      cy.task('generateTravelItinerary').then((itinerary) => {
        expect(itinerary.carRental).to.have.all.keys('company', 'carModel', 'pickupLocation');
      });
    });

    it('generates planned activities array', () => {
      cy.task('generateTravelItinerary').then((itinerary) => {
        expect(itinerary.plannedActivities).to.be.an('array').and.to.have.length(3);
      });
    });

    it('generates valid emergency contact structure', () => {
      cy.task('generateTravelItinerary').then((itinerary) => {
        expect(itinerary.emergencyContact).to.have.all.keys('name', 'phone', 'relationship');
      });
    });
  });

  context('Seed Functionality', () => {
    it('generates identical itineraries with same seed', () => {
      const seed = 12345;
      cy.task('generateTravelItinerary', { seed }).then((i1) => {
        cy.task('generateTravelItinerary', { seed }).then((i2) => {
          expect(i1.travelerName).to.equal(i2.travelerName);
          expect(i1.destination).to.equal(i2.destination);
          expect(i1.departureDate).to.equal(i2.departureDate);
          expect(i1.passportNumber).to.equal(i2.passportNumber);
        });
      });
    });

    it('generates different itineraries with different seeds', () => {
      cy.task('generateTravelItinerary', { seed: 12345 }).then((i1) => {
        cy.task('generateTravelItinerary', { seed: 67890 }).then((i2) => {
          expect(i1.travelerName).to.not.equal(i2.travelerName);
        });
      });
    });
  });

  context('Locale Support', () => {
    it('generates itinerary with specific locale', () => {
      cy.task('generateTravelItinerary', { locale: 'de' }).then(expectValidTravelItinerary);
    });

    it('falls back to default for unsupported locale', () => {
      cy.task('generateTravelItinerary', { locale: 'xx' }).then(expectValidTravelItinerary);
    });
  });

  context('Date Validation', () => {
    it('generates return date after departure date', () => {
      cy.task('generateTravelItinerary').then((itinerary) => {
        const departure = new Date(itinerary.departureDate);
        const returnDate = new Date(itinerary.returnDate);
        expect(returnDate).to.be.above(departure);
      });
    });
  });
});
