const elements = require('./modules/elements.js');
const html = require('./modules/html.js');
const page = require('./modules/page.js');

module.exports = new Vuex.Store({
  modules: {
    elements,
    html,
    page
  }
});