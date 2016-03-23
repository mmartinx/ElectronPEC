'use strict';
const Photos = require('../lib/photos');
const app = require('../lib/app');

app.on('rendered', rendered => {
  $('.main').html(rendered);
  var input = $('.spec-name');
  input.focus().val(input.val());
});

$(function() {
  app.emit('view-selected', 'home');

  $('.nav-list li').on('click', function(ev) {
    ev.preventDefault();
    let id = $(this).attr('id');
    app.emit('view-selected', id);
  });

  $('.main').on('keyup', '.spec-name', function(e) {
    app.emit('spec-change', $(e.currentTarget).val());
  });
});
