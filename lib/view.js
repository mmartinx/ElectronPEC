'use strict';

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

class View {
  constructor(viewName) {
    let templatePath = path.join(__dirname, '../views', viewName + '.hbs');
    let source = fs.readFileSync(templatePath, 'utf-8');

    this.template = Handlebars.compile(source);
  }

  toHtml(context) {
    return this.template(context);
  }
}

module.exports = View;
