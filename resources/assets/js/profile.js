
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

/**
 * Event dispatcher
 */

window.Event = new Vue();

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('pages', require('./components/Profile/Pages.vue'));
Vue.component('profile-header', require('./components/Profile/Header.vue'));
Vue.component('profile-tab', require('./components/Profile/ProfileTab.vue'));
Vue.component('account-tab', require('./components/Profile/AccountTab.vue'));

Vue.component('modal', require('./components/Profile/ProfileModal.vue'));

const app = new Vue({
    el: '#app',
    methods: {
        callApi(endpoint, data, successMessage, errorMessage, successCallback = function() {}) {
            let vm = this;

            return axios.post(endpoint, data)
                .then(function (response) {
                    Notification.addMessage('Success', successMessage, 'success');
                    return successCallback.call(vm);
                })
                .catch(function (error) {
                    if (error.response.status === 422) {
                        _.forEach(error.response.data, vm.showFieldMessages);
                    } else {
                        Notification.addMessage('Error!', errorMessage, 'danger');
                    }
                });
        },
        showFieldMessages(field, key) {
            _.forEach(field, message => {
                Notification.addMessage('', message, 'danger');
            });
        }
    }
});
