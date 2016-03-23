'use strict';
const assert = require('assert');
const Storage = require('../lib/storage');
const fs = require('fs');

const path = './data/test.json';

let store = {};

describe('Storage specs', () => {
  beforeEach(() => {
    store = new Storage('test');
    store.destroy();
  });

  after(() => {
    store = new Storage('test');
    store.destroy();
  });

  describe('Initializing storage', () => {
    it('Creates a file if one does not exist already', () => {
      assert.throws(() => fs.accessSync(path));
      store = new Storage('test');
      assert.doesNotThrow(() => fs.accessSync(path));
    });
  });

  describe('Saving data', () => {
    it('Saves data', () => {
      let collection = [
        { Name: 'Jon'},
        { Name: 'Ron'}
      ];

      store.saveCollection(collection);
      let contents = fs.readFileSync(path, 'utf8');

      assert.equal(JSON.stringify(collection), contents);
    });
  });

  describe('Getting data', () => {
    it('Storage with 2 items will return an array of length 2', () => {
      let collection = [
        { Name: 'Jon'},
        { Name: 'Ron'}
      ];

      store.saveCollection(collection);
      let people = store.getCollection();
      assert.equal(collection.length, people.length);
    });
  });
});
