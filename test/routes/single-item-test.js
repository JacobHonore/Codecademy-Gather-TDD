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
      const item = await seedItemToDatabase();
      const response = await request(app)
      .get(`/items/`+item.id);
      assert.include(parseTextFromHTML(response.text, '#item-title'), item.title);
      assert.include(parseTextFromHTML(response.text, '#item-description'), item.description);
    });
    it('renders a 404 if id does not exist', async () => {
      const response = await request(app)
      .get(`/items/IdThatSurelyDoesNotExist`);
      assert.equal(response.status, 404);
    });
  });
});
