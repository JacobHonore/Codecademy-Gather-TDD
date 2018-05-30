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

  describe('#title', () => {
    it('should be a String', () => {
      // Setup
      const notString = 1;
      const item = new Item({title: notString});

      // Verification
      assert.strictEqual(item.title, notString.toString());
    });
    it('should be required', () => {
      // Setup
      const item = new Item({title: ''});

      // Exercise
      item.validateSync();

      // Verification
      assert.equal(item.errors.title.message, 'Path `title` is required.');
    });
  });
  describe('#description', () => {
    it('should be a String', () => {
      // Setup
      const notString = 1;
      const item = new Item({description: notString});

      // Verification
      assert.strictEqual(item.description, notString.toString());
    });
    it('should be required', () => {
      // Setup
      const item = new Item({description: ''});

      // Exercise
      item.validateSync();

      // Verification
      assert.equal(item.errors.description.message, 'Path `description` is required.');
    });
  });
  describe('#imageUrl', () => {
    it('should be a String', () => {
      // Setup
      const notString = 1;
      const item = new Item({imageUrl: notString});

      // Verification
      assert.strictEqual(item.imageUrl, notString.toString());
    });
    it('should be required', () => {
      // Setup
      const item = new Item({imageUrl: ''});

      // Exercise
      item.validateSync();

      // Verification
      assert.equal(item.errors.imageUrl.message, 'Path `imageUrl` is required.');
    });
  });
});
