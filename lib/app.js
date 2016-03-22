'use strict';
const View = require('./view');
const Emitter = require('events').EventEmitter;
const util = require('util');
const request = require('request');
const DB = require('./db')

var App = function() {
  this.on('view-selected', viewName => {
    let view = new View(viewName);
    this.emit('rendered', view.toHtml());
  });
}


util.inherits(App, Emitter);
module.exports = new App();
