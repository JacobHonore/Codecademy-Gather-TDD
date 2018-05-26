const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/update', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('view update page and check if data is there', async () => {
      const item = await seedItemToDatabase();
      const response = await request(app)
      .get(`/items/`+item.id+`/update`);
      assert.include(response.text, item.title);
      assert.include(response.text, item.description);
    });
    it('renders a 404 if id does not exist', async () => {
      const response = await request(app)
      .get(`/items/IdThatSurelyDoesNotExist/update`);
      assert.equal(response.status, 404);
    });
  });
});
