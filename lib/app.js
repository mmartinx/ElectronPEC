'use strict';
const View = require('./view');
const Emitter = require('events').EventEmitter;
const util = require('util');
const request = require('request');
const DB = require('./db')

var App = function () {
  this.on('view-selected', viewName => {
    let view = new View(viewName);
    let ctx = {};
    if (viewName === 'home') {
      const buckets = new DB('buckets');
      ctx.buckets = buckets.query();
    }
    this.emit('rendered', view.toHtml(ctx));
  });

  this.on('view-bucket', id => {
    const buckets = new DB('buckets');
    let view = new View('bucket');
    let bucket = buckets.fetch(id);
    this.emit('rendered', view.toHtml(bucket));
  });

  this.on('new-bucket', bucketName => {
    const buckets = new DB('buckets');
    buckets.save({
      name: bucketName,
      listings: []
    });
    this.emit('view-selected', 'home');
  });

  this.on('delete-bucket', id => {
    const buckets = new DB('buckets');
    buckets.delete(id);
    this.emit('view-selected', 'home');
  });

  this.on('new-listing', (bucketId, listId) => {
    const buckets = new DB('buckets');
    let view = new View('listing');
    let bucket = buckets.fetch(bucketId);
    let ctx = { bucket: bucket };
    if (listId) {
      ctx.listing = bucket.listings.filter(l => l.listId == listId)[0];
    }
    this.emit('rendered', view.toHtml(ctx));
  });

  this.on('save-listing', ctx => {
    let view = new View('bucket');
    const buckets = new DB('buckets');
    let bucket = buckets.fetch(ctx.bucketId);
    for (let i = 0; i < bucket.listings.length; ++i) {
      if (bucket.listings[i].listId === ctx.listId) {
        bucket.listings[i].description = ctx.description;
        buckets.save(bucket);
        this.emit('rendered', view.toHtml(bucket));
        return;
      }
    }

    bucket.listings.push({
      listId: ctx.listId,
      description: ctx.description
    });
    buckets.save(bucket);
    this.emit('rendered', view.toHtml(bucket));
  });
}


util.inherits(App, Emitter);
module.exports = new App();
