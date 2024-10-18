describe('Educational Data Generator', () => {
  context('Basic Generation', () => {
    it('generates valid educational data with default options', () => {
      cy.task('generateEducation').then((education) => {
        expect(education).to.have.all.keys('id', 'degree', 'fieldOfStudy', 'university', 'graduationYear', 'gpa', 'honors', 'activities', 'startDate', 'endDate');
        expect(education.id).to.be.a('string');
        expect(education.degree).to.be.oneOf(['Bachelor', 'Master', 'PhD', 'Associate']);
        expect(education.fieldOfStudy).to.be.a('string');
        expect(education.university).to.be.a('string');
        expect(education.graduationYear).to.be.a('number').and.to.be.within(new Date().getFullYear() - 6, new Date().getFullYear());
        expect(education.gpa).to.be.a('number').and.to.be.within(2.0, 4.0);
        expect(education.honors).to.satisfy((value) => value === null || typeof value === 'string');
        expect(education.activities).to.be.an('array').and.to.have.length(2);
        expect(education.startDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
        expect(education.endDate).to.match(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('generates multiple unique educational records', () => {
      const educations = [];
      cy.wrap([1, 2, 3]).each(() => {
        cy.task('generateEducation').then((education) => {
          educations.push(education);
        });
      }).then(() => {
        const uniqueIds = new Set(educations.map(e => e.id));
        expect(uniqueIds.size).to.equal(3);
      });
    });
  });

  context('Seed Functionality', () => {
    it('generates identical educational data with the same seed', () => {
      const seed = 12345;
      cy.task('generateEducation', { seed }).then((education1) => {
        cy.task('generateEducation', { seed }).then((education2) => {
          expect(education1).to.deep.equal(education2);
        });
      });
    });

    it('generates different educational data with different seeds', () => {
      cy.task('generateEducation', { seed: 12345 }).then((education1) => {
        cy.task('generateEducation', { seed: 67890 }).then((education2) => {
          expect(education1).to.not.deep.equal(education2);
        });
      });
    });
  });

  context('Locale Support', () => {
    it('generates educational data with a specific locale', () => {
      cy.task('generateEducation', { locale: 'de' }).then((education) => {
        expect(education.university).to.be.a('string');
      });
    });

    it('falls back to default locale for unsupported locale', () => {
      cy.task('generateEducation', { locale: 'xx' }).then((education) => {
        expect(education).to.have.all.keys('id', 'degree', 'fieldOfStudy', 'university', 'graduationYear', 'gpa', 'honors', 'activities', 'startDate', 'endDate');
      });
    });
  });

  context('Edge Cases', () => {
    it('generates valid dates', () => {
      cy.task('generateEducation').then((education) => {
        const startDate = new Date(education.startDate);
        const endDate = new Date(education.endDate);
        expect(startDate).to.be.at.most(endDate);
        expect(endDate.getFullYear()).to.equal(education.graduationYear);
      });
    });

    it('handles honors correctly', () => {
      cy.task('generateEducation', { seed: 'with-honors' }).then((education) => {
        expect(education.honors).to.satisfy((value) => value === null || typeof value === 'string');
      });
    });
  });

  context('Negative Cases', () => {
    it('handles invalid seed gracefully', () => {
      cy.task('generateEducation', { seed: 'invalid-seed' }).then((education) => {
        expect(education).to.have.all.keys('id', 'degree', 'fieldOfStudy', 'university', 'graduationYear', 'gpa', 'honors', 'activities', 'startDate', 'endDate');
        expect(education.honors).to.satisfy((value) => value === null || typeof value === 'string');
      });
    });

    it('handles missing options gracefully', () => {
      cy.task('generateEducation', null).then((education) => {
        expect(education).to.have.all.keys('id', 'degree', 'fieldOfStudy', 'university', 'graduationYear', 'gpa', 'honors', 'activities', 'startDate', 'endDate');
      });
    });
  });
});
