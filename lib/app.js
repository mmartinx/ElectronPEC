'use strict';
const View = require('./view');
const Emitter = require('events').EventEmitter;
const util = require('util');
const DB = require('./db');

var App = function() {
  let db = new DB('people');
  let people = db.save([
    {Name: 'Ron'},
    {Name: 'Jim'}
  ]);

  people = db.query({Name: 'Ron'});
  this.on('view-selected', viewName => {
    let view = new View(viewName);
    let ctx = {
      Something: 'cool',
      People: people
    };
    this.emit('rendered', view.toHtml(ctx));
  });
}

util.inherits(App, Emitter);
module.exports = new App();
