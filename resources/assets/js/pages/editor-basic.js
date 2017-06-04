require('./../bootstrap');

Vue.component('text-editor', require('./../components/Editor/TextEditor.vue'));
Vue.component('preview-panel', require('./../components/Editor/Preview.vue'));
Vue.component('left-sidebar-tabs', require('./../components/LeftSidebar/Tabs.vue'));
Vue.component('left-sidebar-tab', require('./../components/LeftSidebar/Tab.vue'));
Vue.component('page-info-panel', require('./../components/RightSidebar/PageInfo.vue'));
Vue.component('source-panel', require('./../components/RightSidebar/Source.vue'));

/**
 * Event dispatcher
 */

window.Event = new Vue();

/**
 * Vuex store
 */

const store = require('./../store/index.js');

const app = new Vue({
    el: '#app',
    store,
    computed: {
        pageName() {
            const state = this.$store.state.page;
            return state.title || state.id || 'New Page';
        }
    },
    methods: {
        startCallaborate(e) {
            e.preventDefault();
            TogetherJS(this);
            
            return false;
        },
        save(e) {
            e.preventDefault();
            const endpoint = window.User ? '/api/page/create' : '/api/page/create/anon';

            return axios.post(endpoint, this.$store.state.page)
            .then(function (response) {
                window.location.href = '/page/' + response.data.page_id;
            })
            .catch(function (error) {
                Notification.addMessage('Error!', 'Page could not be saved.', 'danger');
            });
        },
        update(e) {
            e.preventDefault();
            const endpoint = window.User ? '/api/page/update' : '/api/page/update/anon';

            return axios.post(endpoint, this.$store.state.page)
            .then(function (response) {
                Notification.addMessage('Success', 'Page has been successfully updated.', 'success');
            })
            .catch(function (error) {
                Notification.addMessage('Error!', 'Page could not be updated.', 'danger');
            });
        }
    }
});
