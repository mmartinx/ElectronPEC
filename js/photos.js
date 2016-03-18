'use strict';
const fs = require('fs');

String.prototype.contains = function(str) {
  return this.toLowerCase().indexOf(str.toLowerCase()) > -1;
};

class Photos {
  static getPhotos() {
    return fs.readdirSync('./photos')
                .filter(p => p.contains('jpg') || p.contains('png'));
  }
}

module.exports = Photos;
