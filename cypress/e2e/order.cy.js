import { expectValidOrder } from '../support/schemas';

describe('Order Data Generation - Happy Scenarios', () => {
    it('generates a basic order', () => {
      cy.task('generateOrder').then(expectValidOrder);
    })
  
    it('generates an order with multiple products', () => {
      cy.task('generateOrder', { productCount: 3 }).then((order) => {
        expect(order.products).to.have.length(3)
      })
    })
  
    it('generates an order with a specific locale', () => {
      cy.task('generateOrder', { locale: 'de' }).then((order) => {
        expect(order.shippingAddress.country).to.match(/^[A-Z]/); // German country names start with a capital letter
      })
    })
  
    it('generates reproducible orders with a specific seed', () => {
      const seed = 12345;
      cy.task('generateOrder', { seed }).then((order1) => {
        cy.task('generateOrder', { seed }).then((order2) => {
          // Check that certain fields are identical
          expect(order1.customerName).to.equal(order2.customerName);
          expect(order1.shippingAddress).to.deep.equal(order2.shippingAddress);
          
          // Check that the products have the same names and prices
          expect(order1.products.length).to.equal(order2.products.length);
          for (let i = 0; i < order1.products.length; i++) {
            expect(order1.products[i].name).to.equal(order2.products[i].name);
            expect(order1.products[i].price).to.equal(order2.products[i].price);
          }
          
          // Check that the total amount is the same
          expect(order1.totalAmount).to.equal(order2.totalAmount);
        });
      });
    })
  
    it('calculates total amount correctly', () => {
      cy.task('generateOrder', { productCount: 5 }).then((order) => {
        const calculatedTotal = order.products.reduce((sum, product) => sum + product.price, 0)
        expect(order.totalAmount).to.equal(calculatedTotal)
      })
    })
  
    it('generates unique order IDs', () => {
      cy.task('generateOrder').then((order1) => {
        cy.task('generateOrder').then((order2) => {
          expect(order1.id).to.not.equal(order2.id)
        })
      })
    })
  
    it('generates valid product data within the order', () => {
      cy.task('generateOrder').then((order) => {
        const product = order.products[0]
        expect(product).to.have.property('id')
        expect(product).to.have.property('name')
        expect(product).to.have.property('price').and.to.be.a('number')
        expect(product).to.have.property('category')
        expect(product).to.have.property('inStock').and.to.be.a('boolean')
      })
    })
  
    it('generates a valid shipping address', () => {
      cy.task('generateOrder').then((order) => {
        const address = order.shippingAddress
        expect(address).to.have.property('street')
        expect(address).to.have.property('city')
        expect(address).to.have.property('state')
        expect(address).to.have.property('zipCode')
        expect(address).to.have.property('country')
      })
    })
  })