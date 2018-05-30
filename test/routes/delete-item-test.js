const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:id/delete', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('POST', () => {
    it('delete item and check if redirects', async () => {
      // Setup
      const item = await seedItemToDatabase();

      // Exercise
      const response = await request(app)
      .post(`/items/`+item.id+`/delete`);

      // Verification
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    });
    it('renders a 404 if id does not exist', async () => {
      // Setup
      const response = await request(app)
      .post(`/items/IdThatSurelyDoesNotExist/delete`);

      // Verification
      assert.equal(response.status, 404);
    });
  });
});
