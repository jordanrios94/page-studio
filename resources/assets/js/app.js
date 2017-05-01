
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

Vue.component('text-editor', require('./components/TextEditor.vue'));
Vue.component('preview-panel', require('./components/Preview.vue'));
Vue.component('left-sidebar-tabs', require('./components/LeftSidebarTabs.vue'));
Vue.component('left-sidebar-tab', require('./components/LeftSidebarTab.vue'));
Vue.component('page-info-panel', require('./components/RightSidebar/PageInfo.vue'));
Vue.component('source-panel', require('./components/RightSidebar/Source.vue'));

const app = new Vue({
    el: '#app',
    data: {
        id: '',
        title: '',
        description: '',
        html: '',
        css: '',
        js: '',
        settings: [],
        scripts: [],
        styles: []
    },
    created() {
        let vm = this;
        this.initData();

        Event.$on('editor_updated', function($event) {
            vm[$event.type] = $event.value;
            vm.updatePreview();
        });

        Event.$on('page_updated', function($event) {
            vm[$event.setting] = $event.value;
        });
    },
    methods: {
        startCallaborate(e) {
            e.preventDefault();
            TogetherJS(this);
            
            return false;
        },
        save(e) {
            e.preventDefault();

            return axios.post('/api/editor/create', this.getData())
            .then(function (response) {
                window.location.href = '/editor/' + response.data.page_id;
            })
            .catch(function (error) {
                Notification.addMessage('Error!', 'Page could not be saved.', 'danger');
            });
        },
        update(e) {
            e.preventDefault();

            return axios.post('/api/editor/update', this.getData())
            .then(function (response) {
                Notification.addMessage('Success', 'Page has been successfully updated.', 'success');
            })
            .catch(function (error) {
                Notification.addMessage('Error!', 'Page could not be updated.', 'danger');
            });
        },
        updatePreview() {
            Event.$emit('update_preview', {
                data: this.getData()
            });
        },
        initData() {
            const data = window.Page ? Page.data : {};
            const page = data.page || {};

            this.id = page.id || '';
            this.title = page.title || '';
            this.description = page.description || '';
            this.settings = page.settings ? JSON.parse(page.settings) : [];
            this.scripts = page.scripts ? JSON.parse(page.scripts) : [];
            this.styles = page.styles ? JSON.parse(page.styles) : [];
        },
        getData() {
            return {
                id: this.id,
                title: this.title,
                description: this.description,
                html: this.html,
                css: this.css,
                js: this.js,
                settings: this.settings,
                scripts: this.scripts,
                styles: this.styles
            };
        }
    }
});
