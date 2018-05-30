const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User visits the single items page ', () => {
    describe('creates a new item and navigates to it', () => {
      it('items description is rendered', () => {
        // Setup
        const item = buildItemObject();
        browser.url('/items/create');

        // Exercise
        browser.setValue('#title-input', item.title);
        browser.setValue('#description-input', item.description);
        browser.setValue('#imageUrl-input', item.imageUrl);
        browser.click('#submit-button');
        browser.click('.item-card a');

        // Verification
        assert.include(browser.getText('body'), item.description);
      });
    });
});
