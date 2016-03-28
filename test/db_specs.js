'use strict';
const assert = require('assert');
const DB = require('../lib/db');
const moment = require('moment');

let testableDb = function() {
  let db = new DB('test');
  db.clear();
  return new DB('test');
}

let db = {};

describe('DB Specs', () => {
  beforeEach(() => {
    db = testableDb();
  });

  after(() => {
    let db = new DB('test');
    db.clear();
  });

  describe('An empty DB', () => {
    it('Has no data', () => {
      assert.equal(db.query(), 0);
    });
  });

  describe('Saving', () => {
    describe('A single element', () => {
      it('Saves a single element', () => {
        db.save({Name: 'Steve'});
        assert.equal(db.query().length, 1);
      });

      it('Saving an element with the same id will update rather than insert', () => {
        let original = { Name: 'Jon' };
        db.save(original);
        assert(db.query().length, 1);
        let originalId = db.query()[0].id;

        original.Name = 'Jim';
        db.save(original);
        assert(db.query().length, 1);
        let updatedId = db.query()[0].id;

        assert.equal(originalId, updatedId);
      });

      it('Gives a createdOn timestamp when saving', () => {
        let person = { Name: 'Jon' };
        db.save(person);
        person = db.query()[0];

        let now = moment(new Date());
        let timestamp = moment(person.createdOn);
        let diff = Math.abs(now.diff(timestamp));
        assert(diff < 1000);
      });

      it('Gives an updatedOn timestmap when updating', () => {
        let person = { Name: 'Jon' };
        db.save(person);
        person.Name = 'Jim';
        db.save(person);
        person = db.query()[0];

        let now = moment(new Date());
        let timestamp = moment(person.updatedOn);
        let diff = Math.abs(now.diff(timestamp));
        assert(diff < 1000);
      });

      it('Returns the same element with an id and created timestamp when saved', () => {
        let jon = { Name: 'Jon' };
        let result = db.save(jon);
        assert.ok(result.hasOwnProperty('id'));
        assert.ok(result.hasOwnProperty('createdOn'));
        assert.equal(result.Name, jon.Name);
      });
    });

    describe('Multiple elements', () => {
      it('Saves arrays of elements', () => {
        let people = [
          { Name: 'Jim'},
          { Name: 'Jon'},
          { Name: 'Ron'}
        ];

        db.save(people);
        let fetched = db.query();
        assert.equal(fetched.length, people.length);
      });

      it('Gives unique ids when saving new items', () => {
        db.save([
          { Name: 'Jim'},
          { Name: 'Ron'}
        ]);

        let jim = db.query({Name: 'Jim'})[0];
        let ron = db.query({Name: 'Ron'})[0];

        assert.ok(jim.id);
        assert.ok(ron.id);
        assert.notEqual(jim.id, ron.id);
      });

      it('Updates elements with existing ids', () => {
        db.save([
          { Name: 'Jim'},
          { Name: 'Ron'}
        ]);

        let people = db.query();
        db.save(people);
        assert.equal(db.query().length, 2);
      });

      it('Returns the same elements with an id and created timestamp when saved', () => {
        let people = [{ Name: 'Jon' }, { Name: 'Jim'}];
        let result = db.save(people);
        assert.equal(people.length, result.length);
        for (let i = 0; i < result.length; ++i) {
          assert.ok(result[i].hasOwnProperty('id'));
          assert.ok(result[i].hasOwnProperty('createdOn'));
          assert.equal(result[i].Name, people[i].Name);
        }
      });
    });
  });

  describe('Fetching an element', () => {
    it('Returns an single element by id', () => {
      let person = { Name: 'Jon' };
      db.save(person);
      let id = db.query()[0].id;
      person = db.fetch(id);
      assert.equal(id, person.id);
    });

    it('Returns an empty object literal if no match', () => {
      let noMatch = db.fetch('fake');
      assert.deepEqual(noMatch, {});
    });
  });

  describe('Querying elements', () => {
    it('Returns matches on an object literal', () => {
      let people = [
        { Name: 'Jim'},
        { Name: 'Jon'},
        { Name: 'Ron'}
      ];
      db.save(people);

      let queried = db.query({Name: 'Ron'});
      assert.equal(queried.length, 1);
    });

    it('Returns matches on a function', () => {
      let people = [
        { Name: 'Jim'},
        { Name: 'Jon'},
        { Name: 'Ron'}
      ];
      db.save(people);

      let queried = db.query(item => {
        return item.Name[0] === 'J';
      });

      assert.equal(queried.length, 2);
    });
  });

  describe('Deleting an element', () => {
    it('Deletes an element with an id', () => {
      let people = [
        { Name: 'Jim'},
        { Name: 'Jon'},
        { Name: 'Ron'}
      ];
      db.save(people);

      let ron = db.query({Name: 'Ron'})[0];
      db.delete(ron);
      assert.equal(db.query().length, 2);

      let jim = db.query({Name: 'Jim'})[0];
      db.delete(jim.id);
      assert.equal(db.query().length, 1);
    });
  });
});
