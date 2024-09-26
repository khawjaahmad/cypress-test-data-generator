const dataGenerator = require('../../src/index');

describe('Data Generator Plugin', () => {
  let generator;

  beforeEach(() => {
    generator = dataGenerator();
  });

  describe('Category data generation', () => {
    it('should generate a category with correct properties', () => {
      const category = generator.generateCategory();
      expect(category).to.have.all.keys('id', 'name', 'description', 'parentId', 'slug', 'isActive');
      expect(category.id).to.be.a('string');
      expect(category.name).to.be.a('string');
      expect(category.description).to.be.a('string');
      expect(category.slug).to.be.a('string');
      expect(category.isActive).to.be.a('boolean');
    });

    it('should generate a category with a specific parent ID', () => {
      const parentId = 'parent123';
      const category = generator.generateCategory({ parentId });
      expect(category.parentId).to.equal(parentId);
    });
  });

  describe('Inventory data generation', () => {
    it('should generate inventory data with correct properties', () => {
      const productId = 'product123';
      const inventory = generator.generateInventory(productId);
      expect(inventory).to.have.all.keys('productId', 'quantity', 'lastUpdated', 'warehouseLocation', 'reorderPoint');
      expect(inventory.productId).to.equal(productId);
      expect(inventory.quantity).to.be.a('number');
      expect(inventory.lastUpdated).to.be.an.instanceOf(Date);
      expect(inventory.warehouseLocation).to.be.a('string');
      expect(inventory.reorderPoint).to.be.a('number');
    });
  });

  describe('Coupon data generation', () => {
    it('should generate a coupon with correct properties', () => {
      const coupon = generator.generateCoupon();
      expect(coupon).to.have.all.keys('code', 'discountType', 'discountValue', 'expirationDate', 'minPurchaseAmount', 'isActive');
      expect(coupon.code).to.be.a('string');
      expect(coupon.discountType).to.be.oneOf(['percentage', 'fixed']);
      expect(coupon.discountValue).to.be.a('number');
      expect(coupon.expirationDate).to.be.an.instanceOf(Date);
      expect(coupon.minPurchaseAmount).to.be.a('number');
      expect(coupon.isActive).to.be.a('boolean');
    });
  });

  describe('Shipping method data generation', () => {
    it('should generate a shipping method with correct properties', () => {
      const shippingMethod = generator.generateShippingMethod();
      expect(shippingMethod).to.have.all.keys('id', 'name', 'price', 'estimatedDeliveryDays', 'provider', 'isAvailable');
      expect(shippingMethod.id).to.be.a('string');
      expect(shippingMethod.name).to.be.oneOf(['Standard', 'Express', 'Overnight']);
      expect(shippingMethod.price).to.be.a('number');
      expect(shippingMethod.estimatedDeliveryDays).to.be.a('number');
      expect(shippingMethod.provider).to.be.a('string');
      expect(shippingMethod.isAvailable).to.be.a('boolean');
    });
  });

  describe('Payment method data generation', () => {
    it('should generate a payment method with correct properties', () => {
      const paymentMethod = generator.generatePaymentMethod();
      expect(paymentMethod).to.have.all.keys('id', 'type', 'name', 'isDefault', 'lastFour', 'expiryDate');
      expect(paymentMethod.id).to.be.a('string');
      expect(paymentMethod.type).to.be.oneOf(['Credit Card', 'PayPal', 'Bank Transfer', 'Cash on Delivery']);
      expect(paymentMethod.name).to.be.a('string');
      expect(paymentMethod.isDefault).to.be.a('boolean');
      expect(paymentMethod.lastFour).to.be.a('string').and.to.have.lengthOf(4);
      expect(paymentMethod.expiryDate).to.be.an.instanceOf(Date);
    });
  });

  describe('Product with relations data generation', () => {
    it('should generate a product with related products', () => {
      const productWithRelations = generator.generateProductWithRelations({ relatedProductCount: 2 });
      expect(productWithRelations).to.have.property('relatedProducts').that.is.an('array').with.lengthOf(2);
      expect(productWithRelations.relatedProducts[0]).to.have.property('relatedToProductId', productWithRelations.id);
    });
  });

  describe('Bulk data generation', () => {
    it('should generate bulk user data', () => {
      const users = generator.generateBulk(generator.generateUser, 5);
      expect(users).to.be.an('array').with.lengthOf(5);
      users.forEach(user => {
        expect(user).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'age', 'address');
      });
    });

    it('should generate bulk product data', () => {
      const products = generator.generateBulk(generator.generateProduct, 3);
      expect(products).to.be.an('array').with.lengthOf(3);
      products.forEach(product => {
        expect(product).to.have.all.keys('id', 'name', 'description', 'price', 'category', 'inStock', 'image', 'sku', 'relatedProducts');
      });
    });
  });

  describe('Error handling', () => {
    it('should handle invalid age range in user generation', () => {
      const result = generator.generateUser({ ageMin: 30, ageMax: 20 });
      expect(result).to.have.property('error').that.includes('Max 20 should be greater than min 30');
    });

    it('should handle invalid product count in order generation', () => {
      expect(() => generator.generateOrder({ productCount: 0 })).to.throw('Product count must be a positive number');
    });
  });

  describe('Custom options and fields', () => {
    it('should apply custom fields to generated product', () => {
      const customFields = { brand: 'TestBrand', weight: '1kg' };
      const product = generator.generateProduct({ customFields });
      expect(product).to.include(customFields);
    });
  });

  describe('Seed consistency', () => {
    it('should generate consistent data with the same seed', () => {
      const seed = 12345;
      const product1 = generator.generateProduct({ seed });
      const product2 = generator.generateProduct({ seed });
      expect(product1).to.deep.equal(product2);
    });
  });
});
