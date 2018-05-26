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
      const response = await request(app)
        .get('/items/create');

      assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), '');
      assert.equal(parseTextFromHTML(response.text, 'input#imageUrl-input'), '');

    });
  });

  describe('POST', () => {
    it('creates and check if the item has been created', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);
      const createdItem = await Item.findOne(itemToCreate);
      assert.isOk(createdItem, 'Item was not created successfully in the database');
    });
    it('creates and check if it redirects', async () => {
      const itemToCreate = buildItemObject();
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(itemToCreate);
      assert.equal(response.status, 302);
      assert.equal(response.headers.location, '/');
    });
    it('shows an error message if no title', async () => {
      const invalidItemToCreate = {
        description: 'Just the best item',
        imageUrl: 'http://placebear.com/g/200/300'
      }
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(invalidItemToCreate);
      assert.deepEqual(await Item.find({}), []);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
    it('shows an error message if no description', async () => {
      const invalidItemToCreate = {
        title: 'Just the best item',
        imageUrl: 'http://placebear.com/g/200/300'
      }
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(invalidItemToCreate);
      assert.deepEqual(await Item.find({}), []);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
    it('shows an error message if no imageUrl', async () => {
      const invalidItemToCreate = {
        title: 'The best item',
        description: 'Just the best item'
      }
      const response = await request(app)
        .post('/items/create')
        .type('form')
        .send(invalidItemToCreate);
      assert.deepEqual(await Item.find({}), []);
      assert.equal(response.status, 400);
      assert.include(parseTextFromHTML(response.text, 'form'), 'required');
    });
  });

});
