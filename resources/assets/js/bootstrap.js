
window._ = require('lodash');

/**
 * We'll load jQuery and the Bootstrap jQuery plugin which provides support
 * for JavaScript based Bootstrap features such as modals and tabs. This
 * code may be modified to fit the specific needs of your application.
 */

window.$ = window.jQuery = require('jquery');

require('bootstrap-sass');
window.Sortable = require('sortablejs');
require('./../lib/jquery/jquery.ui.min');
require('./../lib/jquery.nanoscroller/javascripts/jquery.nanoscroller.min');
window.FastClick = require('./../lib/fast-click/fast-click.min');
window.tinycolor = require('./../lib/tiny-color/tiny-color.min');
require('./../lib/touch-swipe/touch-swipe.min');
require('./../lib/bootstrap-breakpoint/breakpoint.min');
require('./../lib/jquery.gritter/js/jquery.gritter');
// require('./../lib/amaretti/amaretti');


/**
 * We'll load all helper classes created for the application to use.
 */
require('./helpers/notification');

/**
 * Vue is a modern JavaScript library for building interactive web interfaces
 * using reactive data binding and reusable components. Vue's API is clean
 * and simple, leaving you to focus on building your next great project.
 */
window.Vue = require('vue');

Vue.directive('sortable', {
  inserted: function (el, binding) {
    var sortable = new Sortable(el, binding.value || {});
  }
});

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

window.axios = require('axios');

window.axios.defaults.headers.common = {
    'X-CSRF-TOKEN': window.Laravel.csrfToken,
    'API-TOKEN': window.Laravel.apiToken,
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
