require('./../bootstrap');

Vue.component('pages', require('./../components/Profile/Pages.vue'));
Vue.component('profile-header', require('./../components/Profile/Header.vue'));
Vue.component('profile-tab', require('./../components/Profile/ProfileTab.vue'));
Vue.component('account-tab', require('./../components/Profile/AccountTab.vue'));
Vue.component('modal', require('./../components/Profile/ProfileModal.vue'));

/**
 * Event dispatcher
 */

window.EventBus = new Vue();

const app = new Vue({
    el: '#app',
    methods: {
        callApi(endpoint, data, successMessage, errorMessage, successCallback = function() {}) {
            const vm = this;

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
