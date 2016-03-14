const fs = require('fs');

String.prototype.contains = function(str) {
  return this.toLowerCase().indexOf(str.toLowerCase()) > -1;
};

var Photos = function() {
  this.getPhotos = function() {
    return fs.readdirSync('./photos').filter((p => {
      return p.contains('jpg') || p.contains('png');
    }));
  }
}

module.exports = new Photos();
