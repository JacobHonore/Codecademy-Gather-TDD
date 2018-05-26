const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  // Write your tests below:
  describe('#title', () => {
    it('should be a String', () => {
      const notString = 1;
      const item = new Item({title: notString});
      assert.strictEqual(item.title, notString.toString());
    });
    it('should be required', () => {
      const item = new Item({title: ''});
      item.validateSync();
      assert.equal(item.errors.title.message, 'Path `title` is required.');
    });
  });
  describe('#description', () => {
    it('should be a String', () => {
      const notString = 1;
      const item = new Item({description: notString});
      assert.strictEqual(item.description, notString.toString());
    });
    it('should be required', () => {
      const item = new Item({description: ''});
      item.validateSync();
      assert.equal(item.errors.description.message, 'Path `description` is required.');
    });
  });
  describe('#imageUrl', () => {
    it('should be a String', () => {
      const notString = 1;
      const item = new Item({imageUrl: notString});
      assert.strictEqual(item.imageUrl, notString.toString());
    });
    it('should be required', () => {
      const item = new Item({imageUrl: ''});
      item.validateSync();
      assert.equal(item.errors.imageUrl.message, 'Path `imageUrl` is required.');
    });
  });
});
