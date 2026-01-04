import { expectValidApiResponse, expectValidLogEntry } from '../support/schemas';

describe('Technical & API Generators', () => {
  describe('API Response Generator', () => {
    context('Basic Generation', () => {
      it('generates valid API response with default options', () => {
        cy.task('generateApiResponse').then(expectValidApiResponse);
      });

      it('generates API response with valid status codes', () => {
        cy.task('generateApiResponse').then((response) => {
          const validStatusCodes = [200, 201, 204, 400, 401, 403, 404, 500, 502, 503];
          expect(response.statusCode).to.be.oneOf(validStatusCodes);
        });
      });

      it('generates successful response with data', () => {
        cy.task('generateApiResponse', { success: true }).then((response) => {
          expect(response.success).to.equal(true);
          expect(response.data).to.not.be.null;
          expect(response.data).to.have.all.keys('id', 'createdAt', 'updatedAt');
          expect(response.error).to.be.null;
        });
      });

      it('generates error response with error object', () => {
        cy.task('generateApiResponse', { success: false }).then((response) => {
          expect(response.success).to.equal(false);
          expect(response.data).to.be.null;
          expect(response.error).to.have.all.keys('code', 'message', 'details');
        });
      });

      it('generates API response with valid meta structure', () => {
        cy.task('generateApiResponse').then((response) => {
          expect(response.meta).to.have.all.keys('requestId', 'timestamp', 'version', 'rateLimit');
          expect(response.meta.requestId).to.be.a('string');
          expect(response.meta.timestamp).to.be.a('string');
          expect(response.meta.rateLimit).to.have.all.keys('limit', 'remaining', 'reset');
        });
      });

      it('generates API response with optional pagination', () => {
        cy.task('generateApiResponse').then((response) => {
          if (response.pagination !== null) {
            expect(response.pagination).to.have.all.keys('page', 'pageSize', 'totalItems', 'totalPages');
            expect(response.pagination.page).to.be.a('number').and.to.be.at.least(1);
          }
        });
      });

      it('generates API response with valid timestamp', () => {
        cy.task('generateApiResponse').then((response) => {
          expect(response.meta.timestamp).to.be.a('string');
          const timestamp = new Date(response.meta.timestamp);
          expect(timestamp.toString()).to.not.equal('Invalid Date');
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates API responses with same core data using same seed', () => {
        const seed = 12345;
        cy.task('generateApiResponse', { seed }).then((response1) => {
          cy.task('generateApiResponse', { seed }).then((response2) => {
            expect(response1.success).to.equal(response2.success);
            expect(response1.statusCode).to.equal(response2.statusCode);
            expect(response1.meta.requestId).to.equal(response2.meta.requestId);
          });
        });
      });

      it('generates different API responses with different seeds', () => {
        cy.task('generateApiResponse', { seed: 111 }).then((response1) => {
          cy.task('generateApiResponse', { seed: 222 }).then((response2) => {
            expect(response1.meta.requestId).to.not.equal(response2.meta.requestId);
          });
        });
      });
    });
  });

  describe('Log Entry Generator', () => {
    context('Basic Generation', () => {
      it('generates valid log entry with default options', () => {
        cy.task('generateLogEntry').then(expectValidLogEntry);
      });

      it('generates log entry with specific level', () => {
        cy.task('generateLogEntry', { level: 'error' }).then((log) => {
          expect(log.level).to.equal('error');
        });
      });

      it('generates log entry with valid service values', () => {
        cy.task('generateLogEntry').then((log) => {
          const validServices = ['api', 'auth', 'database', 'cache', 'queue', 'scheduler', 'webhook'];
          expect(log.service).to.be.oneOf(validServices);
        });
      });

      it('generates log entry with valid environment', () => {
        cy.task('generateLogEntry').then((log) => {
          expect(log.environment).to.be.oneOf(['development', 'staging', 'production']);
        });
      });

      it('generates log entry with valid metadata structure', () => {
        cy.task('generateLogEntry').then((log) => {
          expect(log.metadata).to.have.all.keys('hostname', 'pid', 'memory');
          expect(log.metadata.pid).to.be.a('number');
          expect(log.metadata.memory).to.be.a('number');
        });
      });

      it('generates log entry with valid HTTP method', () => {
        cy.task('generateLogEntry').then((log) => {
          expect(log.method).to.be.oneOf(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
        });
      });

      it('generates log entry with valid response time', () => {
        cy.task('generateLogEntry').then((log) => {
          expect(log.responseTime).to.be.a('number').and.to.be.at.least(1);
        });
      });

      it('generates log entry with valid status code', () => {
        cy.task('generateLogEntry').then((log) => {
          const validStatusCodes = [200, 201, 400, 401, 403, 404, 500];
          expect(log.statusCode).to.be.oneOf(validStatusCodes);
        });
      });

      it('generates log entry with valid timestamp', () => {
        cy.task('generateLogEntry').then((log) => {
          expect(log.timestamp).to.be.a('string');
          const timestamp = new Date(log.timestamp);
          expect(timestamp.toString()).to.not.equal('Invalid Date');
        });
      });

      it('generates log entry with IP address', () => {
        cy.task('generateLogEntry').then((log) => {
          expect(log.ip).to.be.a('string');
          expect(log.ip).to.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates log entries with same core data using same seed', () => {
        const seed = 54321;
        cy.task('generateLogEntry', { seed }).then((log1) => {
          cy.task('generateLogEntry', { seed }).then((log2) => {
            expect(log1.id).to.equal(log2.id);
            expect(log1.level).to.equal(log2.level);
            expect(log1.service).to.equal(log2.service);
            expect(log1.ip).to.equal(log2.ip);
          });
        });
      });
    });
  });
});
