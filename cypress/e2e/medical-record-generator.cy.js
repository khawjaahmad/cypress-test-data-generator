describe('Medical Record Generator', () => {
  context('Basic Generation', () => {
    it('generates valid medical record data with default options', () => {
      cy.task('generateMedicalRecord').then((record) => {
        expect(record).to.have.all.keys('patientId', 'name', 'dateOfBirth', 'gender', 'bloodType', 'height', 'weight', 'allergies', 'medications', 'diagnoses', 'treatmentHistory', 'upcomingAppointments', 'primaryCarePhysician');
        expect(record.patientId).to.be.a('string');
        expect(record.name).to.be.a('string');
        expect(record.dateOfBirth).to.match(/^\d{4}-\d{2}-\d{2}$/);
        expect(record.gender).to.be.oneOf(['male', 'female']);
        expect(record.bloodType).to.be.oneOf(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
        expect(record.height).to.be.a('number').and.to.be.within(150, 200);
        expect(record.weight).to.be.a('number').and.to.be.within(40, 150);
        expect(record.allergies).to.be.an('array').and.to.have.length(2);
        expect(record.medications).to.be.an('array').and.to.have.length(2);
        expect(record.diagnoses).to.be.an('array').and.to.have.length(2);
        expect(record.treatmentHistory).to.be.a('string');
        expect(record.upcomingAppointments).to.match(/^\d{4}-\d{2}-\d{2}$/);
        expect(record.primaryCarePhysician).to.be.a('string');
      });
    });
  });

  context('Seed Functionality', () => {
    it('generates identical medical records with the same seed', () => {
      const seed = 12345;
      cy.task('generateMedicalRecord', { seed }).then((record1) => {
        cy.task('generateMedicalRecord', { seed }).then((record2) => {
          expect(record1).to.deep.equal(record2);
        });
      });
    });

    it('generates different medical records with different seeds', () => {
      cy.task('generateMedicalRecord', { seed: 12345 }).then((record1) => {
        cy.task('generateMedicalRecord', { seed: 67890 }).then((record2) => {
          expect(record1).to.not.deep.equal(record2);
        });
      });
    });
  });

  context('Locale Support', () => {
    it('generates medical record data with a specific locale', () => {
      cy.task('generateMedicalRecord', { locale: 'de' }).then((record) => {
        expect(record).to.have.all.keys('patientId', 'name', 'dateOfBirth', 'gender', 'bloodType', 'height', 'weight', 'allergies', 'medications', 'diagnoses', 'treatmentHistory', 'upcomingAppointments', 'primaryCarePhysician');
      });
    });

    it('falls back to default locale for unsupported locale', () => {
      cy.task('generateMedicalRecord', { locale: 'xx' }).then((record) => {
        expect(record).to.have.all.keys('patientId', 'name', 'dateOfBirth', 'gender', 'bloodType', 'height', 'weight', 'allergies', 'medications', 'diagnoses', 'treatmentHistory', 'upcomingAppointments', 'primaryCarePhysician');
      });
    });
  });

  context('Edge Cases', () => {
    it('handles minimum height and weight', () => {
      cy.task('generateMedicalRecord').then((record) => {
        expect(record.height).to.be.at.least(150);
        expect(record.weight).to.be.at.least(40);
      });
    });

    it('handles maximum height and weight', () => {
      cy.task('generateMedicalRecord').then((record) => {
        expect(record.height).to.be.at.most(200);
        expect(record.weight).to.be.at.most(150);
      });
    });
  });

  context('Negative Cases', () => {
    it('handles invalid seed gracefully', () => {
      cy.task('generateMedicalRecord', { seed: 'invalid-seed' }).then((record) => {
        expect(record).to.have.all.keys('patientId', 'name', 'dateOfBirth', 'gender', 'bloodType', 'height', 'weight', 'allergies', 'medications', 'diagnoses', 'treatmentHistory', 'upcomingAppointments', 'primaryCarePhysician');
      });
    });

    it('handles missing options gracefully', () => {
      cy.task('generateMedicalRecord', null).then((record) => {
        expect(record).to.have.all.keys('patientId', 'name', 'dateOfBirth', 'gender', 'bloodType', 'height', 'weight', 'allergies', 'medications', 'diagnoses', 'treatmentHistory', 'upcomingAppointments', 'primaryCarePhysician');
      });
    });
  });
});
