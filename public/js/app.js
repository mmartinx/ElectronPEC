'use strict';
const Photos = require('../lib/photos');
const app = require('../lib/app');

app.on('rendered', rendered => {
  $('.main').html(rendered);
});

const switchView = function(viewName) {
  app.emit('view-selected', viewName);
  $('.nav-list li').removeClass('active');
  $(`.nav-list [data-nav="${viewName}"]`).addClass('active');
}

$(function() {
  switchView('home');

  $('.main').on('click', '.btn-new-bucket', function(ev) {
    ev.preventDefault();
    let bucketName = $('.txt-bucket-name').val();
    app.emit('new-bucket', bucketName);
    return false;
  });

  $('.main').on('click', '.btn-delete-bucket', function(ev) {
    ev.preventDefault();
    let id = $(this).parent().data('id');
    app.emit('delete-bucket', id);
  });

  $('.main').on('click', '.view-bucket', function(ev) {
    ev.preventDefault();
    let id = $(this).parent().data('id');
    app.emit('view-bucket', id);
  });

  $('.main').on('click', '.btn-new-listing', function(ev) {
    ev.preventDefault();
    let bucketId = $('.hdn-bucket-id').val();
    app.emit('new-listing', bucketId);
  });

  $('.main').on('click', '.btn-save-listing', function(ev) {
    ev.preventDefault();
    let ctx = {
      bucketId: $('.hdn-bucket-id').val(),
      listId: $('.txt-list-id').val(),
      description: $('.txt-description').val()
    };
    app.emit('save-listing', ctx);
  });

  $('.main').on('click', '.view-listing', function(ev) {
    ev.preventDefault();
    let bucketId = $('.hdn-bucket-id').val(),
      listId = $(this).data('listid');
    
    app.emit('new-listing', bucketId, listId);
  });

  $('.nav-list li').on('click', function(ev) {
    let nav = $(this).data('nav');
    switchView(nav);
  });
});
