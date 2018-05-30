const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('renders a single item with title and description', async () => {
      // Setup
      const item = await seedItemToDatabase();

      // Exercise
      const response = await request(app)
      .get(`/items/`+item.id);

      // Verification
      assert.include(parseTextFromHTML(response.text, '#item-title'), item.title);
      assert.include(parseTextFromHTML(response.text, '#item-description'), item.description);
    });
    it('renders a 404 if id does not exist', async () => {
      // Setup
      const response = await request(app)
      .get(`/items/IdThatSurelyDoesNotExist`);

      // Verification
      assert.equal(response.status, 404);
    });
  });
});
