describe('Seed Isolation (regression)', () => {
  it('seeded call is unaffected by an unseeded call made between two seeded calls', () => {
    const seed = 42;
    cy.task('generateUser', { seed }).then((first) => {
      cy.task('generateUser').then(() => {
        cy.task('generateUser', { seed }).then((third) => {
          expect(third).to.deep.equal(first);
        });
      });
    });
  });

  it('unseeded call after a seeded call is non-deterministic', () => {
    cy.task('generateUser', { seed: 99 }).then(() => {
      cy.task('generateUser').then((a) => {
        cy.task('generateUser', { seed: 99 }).then(() => {
          cy.task('generateUser').then((b) => {
            expect(a.id).to.not.equal(b.id);
          });
        });
      });
    });
  });

  it('different generators seeded identically do not pollute each other', () => {
    const seed = 7;
    cy.task('generateUser', { seed }).then((u1) => {
      cy.task('generateProduct', { seed }).then(() => {
        cy.task('generateUser', { seed }).then((u2) => {
          expect(u2).to.deep.equal(u1);
        });
      });
    });
  });

  it('locale switch does not bleed into subsequent default-locale calls', () => {
    const seed = 2024;
    cy.task('generateUser', { seed }).then((en1) => {
      cy.task('generateUser', { seed, locale: 'de' }).then(() => {
        cy.task('generateUser', { seed }).then((en2) => {
          expect(en2).to.deep.equal(en1);
        });
      });
    });
  });
});
