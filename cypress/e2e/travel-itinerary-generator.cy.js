describe('Travel Itinerary Generator', () => {
  context('Basic Generation', () => {
    it('generates valid travel itinerary data with default options', () => {
      cy.task('generateTravelItinerary').then((itinerary) => {
        expect(itinerary).to.have.all.keys('travelerName', 'destination', 'departureDate', 'returnDate', 'flightDetails', 'hotelReservation', 'carRental', 'plannedActivities', 'travelInsurance', 'passportNumber', 'emergencyContact');
        expect(itinerary.travelerName).to.be.a('string');
        expect(itinerary.destination).to.be.a('string');
        expect(itinerary.departureDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
        expect(itinerary.returnDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
        expect(itinerary.flightDetails).to.have.all.keys('airline', 'flightNumber', 'departureTime', 'arrivalTime');
        expect(itinerary.hotelReservation).to.have.all.keys('hotelName', 'checkIn', 'checkOut');
        expect(itinerary.carRental).to.have.all.keys('company', 'carModel');
        expect(itinerary.plannedActivities).to.be.an('array').and.to.have.length(2);
        expect(itinerary.travelInsurance).to.have.all.keys('provider', 'policyNumber');
        expect(itinerary.passportNumber).to.be.a('string').and.to.have.length(9);
        expect(itinerary.emergencyContact).to.have.all.keys('name', 'phone');
      });
    });
  });

  context('Seed Functionality', () => {
    it('generates identical travel itineraries with the same seed', () => {
      const seed = 12345;
      cy.task('generateTravelItinerary', { seed }).then((itinerary1) => {
        cy.task('generateTravelItinerary', { seed }).then((itinerary2) => {
          expect(itinerary1.travelerName).to.equal(itinerary2.travelerName);
          expect(itinerary1.destination).to.equal(itinerary2.destination);
          expect(itinerary1.departureDate).to.equal(itinerary2.departureDate);
          expect(itinerary1.returnDate).to.equal(itinerary2.returnDate);
          expect(itinerary1.flightDetails.airline).to.equal(itinerary2.flightDetails.airline);
          expect(itinerary1.flightDetails.flightNumber).to.equal(itinerary2.flightDetails.flightNumber);
          // Compare dates without milliseconds
          expect(itinerary1.flightDetails.departureTime.split('.')[0]).to.equal(itinerary2.flightDetails.departureTime.split('.')[0]);
          expect(itinerary1.flightDetails.arrivalTime.split('.')[0]).to.equal(itinerary2.flightDetails.arrivalTime.split('.')[0]);
          expect(itinerary1.hotelReservation).to.deep.equal(itinerary2.hotelReservation);
          expect(itinerary1.carRental).to.deep.equal(itinerary2.carRental);
          expect(itinerary1.plannedActivities).to.deep.equal(itinerary2.plannedActivities);
          expect(itinerary1.travelInsurance).to.deep.equal(itinerary2.travelInsurance);
          expect(itinerary1.passportNumber).to.equal(itinerary2.passportNumber);
          expect(itinerary1.emergencyContact).to.deep.equal(itinerary2.emergencyContact);
        });
      });
    });

    it('generates different travel itineraries with different seeds', () => {
      cy.task('generateTravelItinerary', { seed: 12345 }).then((itinerary1) => {
        cy.task('generateTravelItinerary', { seed: 67890 }).then((itinerary2) => {
          expect(itinerary1).to.not.deep.equal(itinerary2);
        });
      });
    });
  });

  context('Locale Support', () => {
    it('generates travel itinerary data with a specific locale', () => {
      cy.task('generateTravelItinerary', { locale: 'de' }).then((itinerary) => {
        expect(itinerary).to.have.all.keys('travelerName', 'destination', 'departureDate', 'returnDate', 'flightDetails', 'hotelReservation', 'carRental', 'plannedActivities', 'travelInsurance', 'passportNumber', 'emergencyContact');
      });
    });

    it('falls back to default locale for unsupported locale', () => {
      cy.task('generateTravelItinerary', { locale: 'xx' }).then((itinerary) => {
        expect(itinerary).to.have.all.keys('travelerName', 'destination', 'departureDate', 'returnDate', 'flightDetails', 'hotelReservation', 'carRental', 'plannedActivities', 'travelInsurance', 'passportNumber', 'emergencyContact');
      });
    });
  });

  context('Edge Cases', () => {
    it('handles minimum date range', () => {
      const currentDate = new Date();
      cy.task('generateTravelItinerary').then((itinerary) => {
        const departureDate = new Date(itinerary.departureDate);
        const returnDate = new Date(itinerary.returnDate);
        expect(departureDate).to.be.at.least(currentDate);
        expect(returnDate).to.be.above(departureDate);
      });
    });

    it('handles maximum date range', () => {
      cy.task('generateTravelItinerary').then((itinerary) => {
        const departureDate = new Date(itinerary.departureDate);
        const returnDate = new Date(itinerary.returnDate);
        const maxDate = new Date(departureDate.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days later
        expect(returnDate).to.be.at.most(maxDate);
      });
    });
  });

  context('Negative Cases', () => {
    it('handles invalid seed gracefully', () => {
      cy.task('generateTravelItinerary', { seed: 'invalid-seed' }).then((itinerary) => {
        expect(itinerary).to.have.all.keys('travelerName', 'destination', 'departureDate', 'returnDate', 'flightDetails', 'hotelReservation', 'carRental', 'plannedActivities', 'travelInsurance', 'passportNumber', 'emergencyContact');
      });
    });
  });
});
