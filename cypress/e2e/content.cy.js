import { expectValidBlogPost, expectValidEvent } from '../support/schemas';

describe('Content & Media Generators', () => {
  describe('Blog Post Generator', () => {
    context('Basic Generation', () => {
      it('generates valid blog post with default options', () => {
        cy.task('generateBlogPost').then(expectValidBlogPost);
      });

      it('generates blog post with valid author structure', () => {
        cy.task('generateBlogPost').then((post) => {
          expect(post.author).to.have.all.keys('id', 'name', 'avatar', 'bio');
          expect(post.author.id).to.be.a('string');
          expect(post.author.name).to.be.a('string');
        });
      });

      it('generates blog post with valid SEO structure', () => {
        cy.task('generateBlogPost').then((post) => {
          expect(post.seo).to.have.all.keys('metaTitle', 'metaDescription', 'keywords');
          expect(post.seo.metaTitle).to.be.a('string');
          expect(post.seo.metaDescription).to.be.a('string');
          expect(post.seo.keywords).to.be.an('array');
        });
      });

      it('generates blog post with tags array', () => {
        cy.task('generateBlogPost').then((post) => {
          expect(post.tags).to.be.an('array').and.to.have.length.at.least(2);
          post.tags.forEach((tag) => {
            expect(tag).to.be.a('string');
          });
        });
      });

      it('generates blog post with valid category', () => {
        cy.task('generateBlogPost').then((post) => {
          const validCategories = [
            'Technology', 'Business', 'Lifestyle', 'Travel',
            'Food', 'Health', 'Finance'
          ];
          expect(post.category).to.be.oneOf(validCategories);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates blog posts with same core data using same seed', () => {
        const seed = 12345;
        cy.task('generateBlogPost', { seed }).then((post1) => {
          cy.task('generateBlogPost', { seed }).then((post2) => {
            // Core seeded fields should match
            expect(post1.id).to.equal(post2.id);
            expect(post1.title).to.equal(post2.title);
            expect(post1.slug).to.equal(post2.slug);
            expect(post1.category).to.equal(post2.category);
            expect(post1.author.name).to.equal(post2.author.name);
          });
        });
      });

      it('generates different blog posts with different seeds', () => {
        cy.task('generateBlogPost', { seed: 111 }).then((post1) => {
          cy.task('generateBlogPost', { seed: 222 }).then((post2) => {
            expect(post1.title).to.not.equal(post2.title);
          });
        });
      });
    });
  });

  describe('Event Generator', () => {
    context('Basic Generation', () => {
      it('generates valid event with default options', () => {
        cy.task('generateEvent').then(expectValidEvent);
      });

      it('generates event with valid organizer structure', () => {
        cy.task('generateEvent').then((event) => {
          expect(event.organizer).to.have.all.keys('id', 'name', 'email', 'logo');
          expect(event.organizer.id).to.be.a('string');
          expect(event.organizer.name).to.be.a('string');
        });
      });

      it('generates event with valid venue structure', () => {
        cy.task('generateEvent').then((event) => {
          expect(event.venue).to.have.all.keys('name', 'address', 'city', 'country', 'coordinates');
          expect(event.venue.coordinates).to.have.all.keys('latitude', 'longitude');
          expect(event.venue.coordinates.latitude).to.be.a('number');
          expect(event.venue.coordinates.longitude).to.be.a('number');
        });
      });

      it('generates event with valid speakers array', () => {
        cy.task('generateEvent').then((event) => {
          expect(event.speakers).to.be.an('array').and.to.have.length.at.least(1);
          event.speakers.forEach((speaker) => {
            expect(speaker).to.have.all.keys('id', 'name', 'title', 'avatar', 'bio');
          });
        });
      });

      it('generates event with valid tickets array', () => {
        cy.task('generateEvent').then((event) => {
          expect(event.tickets).to.be.an('array').and.to.have.length.at.least(1);
          event.tickets.forEach((ticket) => {
            expect(ticket).to.have.all.keys('id', 'name', 'price', 'currency', 'available');
          });
        });
      });

      it('generates event with valid capacity and registrations', () => {
        cy.task('generateEvent').then((event) => {
          expect(event.capacity).to.be.a('number').and.to.be.at.least(10);
          expect(event.registrations).to.be.a('number').and.to.be.at.least(0);
          expect(event.registrations).to.be.at.most(event.capacity);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates events with same core data using same seed', () => {
        const seed = 54321;
        cy.task('generateEvent', { seed }).then((event1) => {
          cy.task('generateEvent', { seed }).then((event2) => {
            expect(event1.id).to.equal(event2.id);
            expect(event1.name).to.equal(event2.name);
            expect(event1.type).to.equal(event2.type);
            expect(event1.organizer.name).to.equal(event2.organizer.name);
          });
        });
      });
    });
  });
});
