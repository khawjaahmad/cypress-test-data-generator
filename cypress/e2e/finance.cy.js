import {
  expectValidBankAccount,
  expectValidLoan,
  expectValidInsurancePolicy
} from '../support/schemas';

describe('Finance Generators', () => {
  describe('Bank Account Generator', () => {
    context('Basic Generation', () => {
      it('generates valid bank account with default options', () => {
        cy.task('generateBankAccount').then(expectValidBankAccount);
      });

      it('generates bank account with valid owner structure', () => {
        cy.task('generateBankAccount').then((account) => {
          expect(account.owner).to.have.all.keys('id', 'name', 'email');
          expect(account.bank).to.have.all.keys('name', 'branch', 'address');
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates accounts with same core data using same seed', () => {
        const seed = 12345;
        cy.task('generateBankAccount', { seed }).then((a1) => {
          cy.task('generateBankAccount', { seed }).then((a2) => {
            expect(a1.id).to.equal(a2.id);
            expect(a1.accountNumber).to.equal(a2.accountNumber);
            expect(a1.accountType).to.equal(a2.accountType);
            expect(a1.owner.name).to.equal(a2.owner.name);
          });
        });
      });
    });
  });

  describe('Loan Generator', () => {
    context('Basic Generation', () => {
      it('generates valid loan with default options', () => {
        cy.task('generateLoan').then(expectValidLoan);
      });

      it('generates loan with specific type', () => {
        cy.task('generateLoan', { type: 'mortgage' }).then((loan) => {
          expect(loan.type).to.equal('mortgage');
        });
      });

      it('generates loan with valid borrower and lender', () => {
        cy.task('generateLoan').then((loan) => {
          expect(loan.borrower).to.have.all.keys('id', 'name', 'email', 'creditScore');
          expect(loan.borrower.creditScore).to.be.a('number').and.to.be.within(300, 850);
          expect(loan.lender).to.have.all.keys('name', 'contactEmail');
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates identical loans with same seed', () => {
        const seed = 54321;
        cy.task('generateLoan', { seed }).then((l1) => {
          cy.task('generateLoan', { seed }).then((l2) => {
            expect(l1).to.deep.equal(l2);
          });
        });
      });
    });
  });

  describe('Insurance Policy Generator', () => {
    context('Basic Generation', () => {
      it('generates valid insurance policy with default options', () => {
        cy.task('generateInsurancePolicy').then(expectValidInsurancePolicy);
      });

      it('generates policy with specific type', () => {
        cy.task('generateInsurancePolicy', { type: 'auto' }).then((policy) => {
          expect(policy.type).to.equal('auto');
        });
      });

      it('generates policy with valid coverage and premium', () => {
        cy.task('generateInsurancePolicy').then((policy) => {
          expect(policy.coverage).to.have.all.keys('amount', 'deductible', 'currency');
          expect(policy.premium).to.have.all.keys('amount', 'frequency', 'nextDueDate');
          expect(policy.premium.frequency).to.be.oneOf(['monthly', 'quarterly', 'semi-annually', 'annually']);
        });
      });

      it('generates policy with valid beneficiaries', () => {
        cy.task('generateInsurancePolicy').then((policy) => {
          expect(policy.beneficiaries).to.be.an('array').and.to.have.length.at.least(1);
          policy.beneficiaries.forEach((beneficiary) => {
            expect(beneficiary).to.have.all.keys('name', 'relationship', 'percentage');
            expect(beneficiary.relationship).to.be.oneOf(['Spouse', 'Child', 'Parent', 'Sibling', 'Other']);
          });
        });
      });
    });

    context('Seed Functionality', () => {
      it('generates policies with same core data using same seed', () => {
        const seed = 99999;
        cy.task('generateInsurancePolicy', { seed }).then((p1) => {
          cy.task('generateInsurancePolicy', { seed }).then((p2) => {
            expect(p1.id).to.equal(p2.id);
            expect(p1.policyNumber).to.equal(p2.policyNumber);
            expect(p1.type).to.equal(p2.type);
            expect(p1.policyholder.name).to.equal(p2.policyholder.name);
          });
        });
      });
    });
  });
});
