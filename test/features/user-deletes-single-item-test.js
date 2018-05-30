const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User deletes a item', () => {
    describe('posts a new item and deletes it', () => {
      it('can no longer be found', () => 0{
        // Setup
        const item = buildItemObject();
        browser.url('/items/create');

        // Exercise
        browser.setValue('#title-input', item.title);
        browser.setValue('#description-input', item.description);
        browser.setValue('#imageUrl-input', item.imageUrl);
        browser.click('#submit-button');

        // Verification
        assert.include(browser.getText('body'), item.title);
        assert.include(browser.getAttribute('body img', 'src'), item.imageUrl);
        browser.submitForm('.item-card .delete-form');
        assert.notInclude(browser.getText('body'), item.title);
      });
    });
});
