'use strict';
const View = require('./view');
const Emitter = require('events').EventEmitter;
const util = require('util');
const request = require('request');
const DB = require('./db')

var App = function() {
  this.specs = new DB('specs');
  this.on('view-selected', viewName => {
    let view = new View(viewName);
    let mills = this.specs.query(item => {
      return item.Name.indexOf('Mill') > -1;
    });
    let context = {
      Mills: mills
    }
    this.emit('rendered', view.toHtml(context));
  });

  this.on('spec-change', name => {
    let view = new View('home');
    let filteredSpecs = [];
    if (name.length >= 3) {
      filteredSpecs = this.specs.query(item => {
        return item.Name.indexOf(name) > -1;
      });
    }
    let context = {
      Mills: filteredSpecs,
      term: name
    }
    console.log(context);
    this.emit('rendered', view.toHtml(context));
  });
}


util.inherits(App, Emitter);
module.exports = new App();
