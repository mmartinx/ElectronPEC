'use strict';

const _ = require('underscore')._;
const Storage = require('./storage');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

class DB {
  constructor(table) {
    this.storage = new Storage(table);
    this.collection = this.storage.getCollection();
  }

  save(doc) {
    let collection = this.storage.getCollection();
    const timestamp = new Date();

    if (doc.hasOwnProperty('id')) {
      for (let i = 0; i < collection.length; ++i) {
        if (collection[i].id === doc.id) {
          doc.lastUpdatedOn = timestamp;
          collection[i] = doc;
          break;
        }
      }
    } else {
      if (Array.isArray(doc)) {
        doc.forEach(d => {
          if (d.hasOwnProperty('id')) {
            for (let i = 0; i < collection.length; ++i) {
              if (collection[i].id === d.id) {
                d.lastUpdatedOn = timestamp;
                collection[i] = d;
                break;
              }
            }
          } else {
            d.id = guid();
            d.createdOn = timestamp;
            collection.push(d);
          }
        });
      } else {
        doc.id = guid();
        doc.createdOn = timestamp;
        collection.push(doc);
      }
    }

    this.storage.saveCollection(collection);
    this.collection = collection;
    return doc;
  }

  fetch(id) {
    const item = this.collection.filter(el => el.id === id)[0];
    return item || {};
  }

  delete(id) {
    id = id.hasOwnProperty('id') ? id.id : id;
    let collection = this.storage.getCollection();
    collection = collection.filter(el => el.id !== id);
    this.storage.saveCollection(collection);
    this.collection = collection;
  }

  query(criteria) {
    return (typeof criteria === 'function') ?
            this.collection.filter(criteria) :
            _.filter(this.collection, criteria);
  }

  clear() {
    this.storage.destroy();
  }

  sync() {
    this.collection = getCollection();
  }
}

module.exports = DB;
