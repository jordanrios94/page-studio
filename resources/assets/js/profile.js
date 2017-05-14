
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
        cover_url: ''
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
        }
    }
});
