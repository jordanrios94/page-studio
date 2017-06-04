<template>
    <div class="editor-panel preview-panel" v-show="isActive">
        <iframe id="preview-iframe" name="preview" src="/page/preview" width="100%" height="100%" frameborder="0" disablehistory="true"></iframe>
        <form id="preview-form" action="/page/preview" method="post" target="preview">
            <input type="hidden" name="html" :value="html" />
            <input type="hidden" name="css" :value="css" />
            <input type="hidden" name="js" :value="js" />
            <input type="hidden" name="scripts" :value="scripts" />
            <input type="hidden" name="styles" :value="styles" />
            <input type="hidden" name="_token" :value="csrfToken">
        </form>
    </div>
</template>

<script>
    export default {
        props: {
            'page-type': {
                type: String,
                default: 'basic'
            },
            'type': {
                type: String,
                default: 'preview'
            },
            'selected': {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                isActive: false
            };
        },
        created() {
            var vm = this;

            vm.isActive = this.selected;

            if (this.pageType === 'bootstrap') {
                Event.$on('tab-selected', function ($event) {
                    vm.isActive = (vm.type == $event.type);
                });
            }

            Event.$on('update_preview', function($event) {
                vm.updatePreview();
            });
        },
        computed: {
            csrfToken() {
                return window.Laravel.csrfToken;
            },
            html() {
                return this.$store.state.page.html;
            },
            css() {
                return this.$store.state.page.css;
            },
            js() {
                return this.$store.state.page.js;
            },
            scripts() {
                return JSON.stringify(this.$store.state.page.scripts);
            },
            styles() {
                return JSON.stringify(this.$store.state.page.styles);
            }
        },
        methods: {
            updatePreview() {
                setTimeout(function() {
                    document.getElementById('preview-form').submit();
                }, 1000);
            }
        }
    }
</script>
