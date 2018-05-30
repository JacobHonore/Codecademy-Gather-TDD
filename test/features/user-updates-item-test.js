const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('User will update from the single items page', () => {
    describe('creates a new item and updates to it', () => {
      it('updated description is rendered', () => {
        // Setup
        const updateTo = {
          title: 'Something Completely Else',
          description: 'Wow this is also something else, what is happening?',
          imageUrl: 'https://upload.wikimedia.org/wikipedia/en/1/19/Something_Else_(picture_book_-_cover_art).jpg'
        }
        const item = buildItemObject();
        browser.url('/items/create');

        // Exercise
        browser.setValue('#title-input', item.title);
        browser.setValue('#description-input', item.description);
        browser.setValue('#imageUrl-input', item.imageUrl);
        browser.click('#submit-button');
        browser.click('.item-card a');
        browser.click('.update-button');
        assert.include(browser.getValue('#title-input'), item.title);
        assert.include(browser.getText('#description-input'), item.description);
        assert.include(browser.getValue('#imageUrl-input'), item.imageUrl);
        browser.setValue('#title-input', updateTo.title);
        browser.setValue('#description-input', updateTo.description);
        browser.setValue('#imageUrl-input', updateTo.imageUrl);
        browser.click('[type=submit]');

        // Verification
        assert.include(browser.getText('body'), updateTo.title);
        assert.include(browser.getAttribute('body img', 'src'), updateTo.imageUrl);
      });
    });
});
