const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  describe('GET', () => {
    it('renders empty input fields', async () => {
      // Setup
      const response = await request(app)
        .get('/items/create');

      // Verification
      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'input#imageUrl-input'), '');

    });
  });

  describe('POST', () => {
    it('creates and check if the item has been created', async () => {
      // Setup
      const itemToCreate = buildItemObject();

      // Exercise
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      // Verification
      const createdItem = await Item.findOne(itemToCreate);
      assert.isOk(createdItem, 'Item was not created successfully in the database');
    });
    it('creates and check if it redirects', async () => {
      // Setup
      const itemToCreate = buildItemObject();

      // Exercise
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);

      // Verification
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    });
    it('shows an error message if no title', async () => {
      // Setup
      const invalidItemToCreate = {
        description: 'Just the best item',
        imageUrl: 'http://placebear.com/g/200/300'
      }

      // Exercise
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(invalidItemToCreate);

      // Verification
      assert.deepEqual(await Item.find({}), []);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
    it('shows an error message if no description', async () => {
      // Setup
      const invalidItemToCreate = {
        title: 'Just the best item',
        imageUrl: 'http://placebear.com/g/200/300'
      }

      // Exercise
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(invalidItemToCreate);

      // Verification
      assert.deepEqual(await Item.find({}), []);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
    it('shows an error message if no imageUrl', async () => {
      // Setup
      const invalidItemToCreate = {
        title: 'The best item',
        description: 'Just the best item'
      }

      // Exercise
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(invalidItemToCreate);

      // Verification
      assert.deepEqual(await Item.find({}), []);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });

});
