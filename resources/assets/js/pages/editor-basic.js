require('./../bootstrap');

/**
 * Event dispatcher
 */
window.EventBus = new Vue();

/**
 * Vuex store
 */
const store = require('./../store/index.js');

/**
 * Mixins
 */
const apis = require('./../mixins/api/editor.js');

const app = new Vue({
    el: '#app',
    store,
    mixins: [apis],
    components: {
        'text-editor': require('./../components/Editor/TextEditor.vue'),
        'preview-panel': require('./../components/Editor/Preview.vue'),
        'left-sidebar-tabs': require('./../components/LeftSidebar/Tabs.vue'),
        'left-sidebar-tab': require('./../components/LeftSidebar/Tab.vue'),
        'page-info-panel': require('./../components/RightSidebar/PageInfo.vue'),
        'source-panel': require('./../components/RightSidebar/Source.vue')
    },
    data: {
        pageType: 'basic'
    },
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
        }
    }
});
