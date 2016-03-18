'use strict';
const View = require('./view');
const Emitter = require('events').EventEmitter;
const util = require('util');

var App = function() {
  this.on('view-selected', viewName => {
    let view = new View(viewName);
    let ctx = {
      Something: 'cool'
    }
    this.emit('rendered', view.toHtml(ctx));
  });
}

util.inherits(App, Emitter);
module.exports = new App();
