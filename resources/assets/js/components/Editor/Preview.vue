<template>
    <div class="editor-panel preview-panel">
        <iframe id="preview-iframe" name="preview" src="/page/preview" width="100%" height="100%" frameborder="0"></iframe>
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
        created() {
            var vm = this;
            
            Event.$on('update_preview', function($event) {
                vm.updatePreview();
            });
        },
        computed: {
            csrfToken() {
                return window.Laravel.csrfToken;
            },
            html() {
                return this.$store.state.html;
            },
            css() {
                return this.$store.state.css;
            },
            js() {
                return this.$store.state.js;
            },
            scripts() {
                return JSON.stringify(this.$store.state.scripts);
            },
            styles() {
                return JSON.stringify(this.$store.state.styles);
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
