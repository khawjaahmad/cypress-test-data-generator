import {
  expectValidInvoice,
  expectValidEmployee,
  expectValidProject,
  expectValidTicket,
  expectValidMeeting
} from '../support/schemas';

describe('Business & Enterprise Generators', () => {
  describe('Invoice Generator', () => {
    context('Basic Generation', () => {
      it('generates valid invoice with default options', () => {
        cy.task('generateInvoice').then(expectValidInvoice);
      });

      it('generates invoice with specific item count', () => {
        cy.task('generateInvoice', { itemCount: 5 }).then((invoice) => {
          expect(invoice.items).to.have.length(5);
        });
      });

      it('generates invoice with correct calculations', () => {
        cy.task('generateInvoice').then((invoice) => {
          const calculatedSubtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
          expect(invoice.subtotal).to.be.closeTo(calculatedSubtotal, 0.01);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates identical invoices with same seed', () => {
        const seed = 12345;
        cy.task('generateInvoice', { seed }).then((i1) => {
          cy.task('generateInvoice', { seed }).then((i2) => {
            expect(i1).to.deep.equal(i2);
          });
        });
      });
    });
  });

  describe('Employee Generator', () => {
    context('Basic Generation', () => {
      it('generates valid employee with default options', () => {
        cy.task('generateEmployee').then(expectValidEmployee);
      });

      it('generates employee with specific department', () => {
        cy.task('generateEmployee', { department: 'Engineering' }).then((employee) => {
          expect(employee.department).to.equal('Engineering');
        });
      });

      it('generates employee with valid salary structure', () => {
        cy.task('generateEmployee').then((employee) => {
          expect(employee.salary).to.have.all.keys('amount', 'currency', 'frequency');
          expect(employee.salary.amount).to.be.a('number').and.to.be.at.least(30000);
          expect(employee.salary.frequency).to.equal('yearly');
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates identical employees with same seed', () => {
        const seed = 54321;
        cy.task('generateEmployee', { seed }).then((e1) => {
          cy.task('generateEmployee', { seed }).then((e2) => {
            expect(e1).to.deep.equal(e2);
          });
        });
      });
    });
  });

  describe('Project Generator', () => {
    context('Basic Generation', () => {
      it('generates valid project with default options', () => {
        cy.task('generateProject').then(expectValidProject);
      });

      it('generates project with valid team structure', () => {
        cy.task('generateProject').then((project) => {
          expect(project.team).to.be.an('array').and.to.have.length.at.least(2);
          project.team.forEach((member) => {
            expect(member).to.have.all.keys('id', 'name', 'role');
          });
        });
      });

      it('generates project with valid milestones', () => {
        cy.task('generateProject').then((project) => {
          expect(project.milestones).to.be.an('array').and.to.have.length.at.least(2);
          project.milestones.forEach((milestone) => {
            expect(milestone).to.have.all.keys('id', 'name', 'dueDate', 'completed');
            expect(milestone.completed).to.be.a('boolean');
          });
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates identical projects with same seed', () => {
        const seed = 99999;
        cy.task('generateProject', { seed }).then((p1) => {
          cy.task('generateProject', { seed }).then((p2) => {
            expect(p1).to.deep.equal(p2);
          });
        });
      });
    });
  });

  describe('Ticket Generator', () => {
    context('Basic Generation', () => {
      it('generates valid ticket with default options', () => {
        cy.task('generateTicket').then(expectValidTicket);
      });

      it('generates ticket with specific customer ID', () => {
        const customerId = 'customer-123';
        cy.task('generateTicket', { customerId }).then((ticket) => {
          expect(ticket.customer.id).to.equal(customerId);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates tickets with same core data using same seed', () => {
        const seed = 77777;
        cy.task('generateTicket', { seed }).then((t1) => {
          cy.task('generateTicket', { seed }).then((t2) => {
            expect(t1.id).to.equal(t2.id);
            expect(t1.ticketNumber).to.equal(t2.ticketNumber);
            expect(t1.subject).to.equal(t2.subject);
            expect(t1.status).to.equal(t2.status);
          });
        });
      });
    });
  });

  describe('Meeting Generator', () => {
    context('Basic Generation', () => {
      it('generates valid meeting with default options', () => {
        cy.task('generateMeeting').then(expectValidMeeting);
      });

      it('generates meeting with valid attendees', () => {
        cy.task('generateMeeting').then((meeting) => {
          expect(meeting.attendees).to.be.an('array').and.to.have.length.at.least(1);
          meeting.attendees.forEach((attendee) => {
            expect(attendee).to.have.all.keys('id', 'name', 'email', 'status', 'isOptional');
            expect(attendee.status).to.be.oneOf(['accepted', 'declined', 'tentative', 'pending']);
          });
        });
      });

      it('generates meeting with correct time calculation', () => {
        cy.task('generateMeeting').then((meeting) => {
          const start = new Date(meeting.startTime);
          const end = new Date(meeting.endTime);
          const durationMs = end - start;
          const durationMinutes = durationMs / (1000 * 60);
          expect(durationMinutes).to.equal(meeting.duration);
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates meetings with same core data using same seed', () => {
        const seed = 88888;
        cy.task('generateMeeting', { seed }).then((m1) => {
          cy.task('generateMeeting', { seed }).then((m2) => {
            expect(m1.id).to.equal(m2.id);
            expect(m1.title).to.equal(m2.title);
            expect(m1.type).to.equal(m2.type);
            expect(m1.duration).to.equal(m2.duration);
          });
        });
      });
    });
  });
});
