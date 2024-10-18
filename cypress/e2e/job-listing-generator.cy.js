describe('Job Listing Generator', () => {
  context('Basic Generation', () => {
    it('generates a valid job listing with default options', () => {
      cy.task('generateJobListing').then((jobListing) => {
        expect(jobListing).to.have.all.keys('id', 'title', 'company', 'location', 'description', 'requirements', 'salary', 'employmentType', 'postedDate', 'applicationDeadline');
        expect(jobListing.id).to.be.a('string');
        expect(jobListing.title).to.be.a('string');
        expect(jobListing.company).to.be.a('string');
        expect(jobListing.location).to.be.a('string');
        expect(jobListing.description).to.be.a('string');
        expect(jobListing.requirements).to.be.an('array').and.have.length(3);
        expect(jobListing.salary).to.have.all.keys('min', 'max');
        expect(jobListing.employmentType).to.be.oneOf(['Full-time', 'Part-time', 'Contract', 'Temporary']);
        expect(jobListing.postedDate).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        expect(jobListing.applicationDeadline).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
      });
    });

    it('generates multiple unique job listings', () => {
      const jobs = [];
      cy.wrap([1, 2, 3, 4, 5]).each(() => {
        cy.task('generateJobListing').then((job) => {
          jobs.push(job);
        });
      }).then(() => {
        const uniqueIds = new Set(jobs.map(j => j.id));
        expect(uniqueIds.size).to.equal(5);
      });
    });
  });

  context('Seed Functionality', () => {
    it('generates identical job listings with the same seed', () => {
      const seed = 12345;
      cy.task('generateJobListing', { seed }).then((jobListing1) => {
        cy.task('generateJobListing', { seed }).then((jobListing2) => {
          expect(jobListing1).to.deep.equal(jobListing2);
        });
      });
    });

    it('generates different job listings with different seeds', () => {
      cy.task('generateJobListing', { seed: 12345 }).then((job1) => {
        cy.task('generateJobListing', { seed: 67890 }).then((job2) => {
          expect(job1).to.not.deep.equal(job2);
        });
      });
    });
  });

  context('Locale Support', () => {
    it('generates a job listing with a specific locale', () => {
      cy.task('generateJobListing', { locale: 'fr' }).then((job) => {
        expect(job.title).to.be.a('string');
        expect(job.company).to.be.a('string');
        // Note: We can't guarantee the title or company will be French, but we can check they're strings
      });
    });

    it('falls back to default locale for unsupported locale', () => {
      cy.task('generateJobListing', { locale: 'xx' }).then((job) => {
        expect(job).to.have.all.keys('id', 'title', 'company', 'location', 'description', 'requirements', 'salary', 'employmentType', 'postedDate', 'applicationDeadline');
      });
    });
  });

  context('Edge Cases', () => {
    it('handles minimum salary values', () => {
      cy.task('generateJobListing', { 
        seed: 'min-salary'
      }).then((job) => {
        expect(job.salary.min).to.be.at.least(0);
        expect(job.salary.max).to.be.at.least(job.salary.min);
      });
    });

    it('handles maximum salary values', () => {
      cy.task('generateJobListing', { 
        seed: 'max-salary'
      }).then((job) => {
        expect(job.salary.max).to.be.at.most(1000000);
      });
    });

    it('generates valid dates', () => {
      cy.task('generateJobListing').then((jobListing) => {
        const postedDate = new Date(jobListing.postedDate);
        const applicationDeadline = new Date(jobListing.applicationDeadline);
        expect(postedDate).to.be.a('date');
        expect(applicationDeadline).to.be.a('date');
        expect(postedDate).to.be.at.most(applicationDeadline);
      });
    });
  });

  context('Negative Cases', () => {
    it('handles invalid seed gracefully', () => {
      cy.task('generateJobListing', { seed: 'invalid-seed' }).then((job) => {
        expect(job).to.have.all.keys('id', 'title', 'company', 'location', 'description', 'requirements', 'salary', 'employmentType', 'postedDate', 'applicationDeadline');
      });
    });

    it('handles missing options gracefully', () => {
      cy.task('generateJobListing', null).then((jobListing) => {
        expect(jobListing).to.have.all.keys('id', 'title', 'company', 'location', 'description', 'requirements', 'salary', 'employmentType', 'postedDate', 'applicationDeadline');
      });
    });
  });
});
