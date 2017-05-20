
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

const app = new Vue({
    el: '#app',
    data: {
        name: '',
        username: '',
        bio: '',
        email: '',
        profile_url: '',
        cover_url: '',
        password: '',
        password_confirmation: ''
    },
    created() {
        let vm = this;
        vm.initData();
    },
    methods: {
        initData() {
            const profile = window.Profile ? Profile.data : {};

            this.name = profile.name || '';
            this.username = profile.username || '';
            this.bio = profile.bio || '';
            this.email = profile.email || '';
            this.profile_url = profile.profile_url || '';
            this.cover_url = profile.cover_url || '';
        },
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
        updateProfile(e) {
            e.preventDefault();

            return this.callApi(
                '/api/profile/update',
                this.getProfileData(),
                'Profile has been successfully updated.',
                'There was a problem saving your profile.'
            );
        },
        updateEmail(e) {
            e.preventDefault();

            return this.callApi(
                '/api/profile/updateEmail',
                { email: this.email },
                'Email has been successfully updated.',
                'There was a problem updating your email.'
            );
        },
        updatePassword(e) {
            e.preventDefault();
            
            return this.callApi(
                '/api/profile/updatePassword',
                { 
                    password: this.password,
                    password_confirmation: this.password_confirmation
                },
                'Password has been successfully updated.',
                'There was a problem updating your password.',
                function () {
                    this.password = this.password_confirmation = '';
                }
            );
        },
        showFieldMessages(field, key) {
            _.forEach(field, message => {
                Notification.addMessage('', message, 'danger');
            });
        },
        getProfileData() {
            return {
                name: this.name,
                username: this.username,
                bio: this.bio,
                profile_url: this.profile_url,
                cover_url: this.cover_url
            };
        }
    },
    computed: {
        displayUsername() {
            return '@' + this.username;
        },
        passwordValid() {
            return _.isEmpty(this.password) ? false : this.password === this.repeated_password;
        }
    }
});
