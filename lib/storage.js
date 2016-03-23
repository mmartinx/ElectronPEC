'use strict';
const fs = require('fs');

class Storage {
  constructor(table) {
    this.path = './data/' + table + '.json';
    try {
      fs.accessSync(this.path)
    } catch (e) {
      fs.closeSync(fs.openSync(this.path, 'w'));
    }
    this.table = table;
  }

  getCollection() {
    let existingJson = '';
    try {
       existingJson = fs.readFileSync(this.path, 'utf8');
     } catch (e) {

     }
    if (existingJson) {
      return JSON.parse(existingJson);
    }

    return [];
  }

  saveCollection(collection) {
    fs.writeFileSync(this.path, JSON.stringify(collection));
  }

  destroy() {
    try {
      fs.writeFileSync(this.path, '');
      fs.unlinkSync(this.path);
    } catch(e) {

    }
  }
}

module.exports = Storage;
