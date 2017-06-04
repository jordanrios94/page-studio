const page = require('./modules/page.js');
const html = require('./modules/html.js');

module.exports = new Vuex.Store({
  modules: {
    page,
    html
  }
});