window._ = require('lodash');
window.$ = window.jQuery = require('jquery');
window.Sortable = require('sortablejs');
window.FastClick = require('fastclick');
window.tinycolor = require('tinycolor2');
window.beautify_js = require('js-beautify');
window.beautify_css = require('js-beautify').css;
window.beautify_html = require('js-beautify').html;
window.moment = require('moment');
window.cropit = require('cropit');

require('bootstrap-less');
require('jquery-touchswipe');
require('bootstrap-slider');
require('./helpers/breakpoint');
require('./../lib/jquery.gritter/js/jquery.gritter');

window.Notification = require('./helpers/notification');
window.Vue = require('vue');
window.Vuex = require('vuex');

Vue.use(window.Vuex);
Vue.directive('sortable', {
  inserted: function (el, binding) {
    var sortable = new Sortable(el, binding.value || {});
  }
});

window.axios = require('axios');
window.axios.defaults.headers.common = {
    'X-CSRF-TOKEN': window.Laravel ? window.Laravel.csrfToken : '',
    'API-TOKEN': window.Laravel ? window.Laravel.apiToken : '',
    'X-Requested-With': 'XMLHttpRequest'
};

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from "laravel-echo"
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'your-pusher-key'
// });
