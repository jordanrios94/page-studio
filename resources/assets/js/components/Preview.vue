<template>
    <div class="editor-panel preview-panel">
        <iframe name="preview" src="/editor/preview" width="100%" height="100%" frameborder="0"></iframe>
        <form id="preview-form" action="/editor/preview" method="post" target="preview">
            <input type="hidden" name="html" :value="html" />
            <input type="hidden" name="css" :value="css" />
            <input type="hidden" name="js" :value="js" />
            <input type="hidden" name="_token" :value="csrfToken">
        </form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                html: '',
                css: '',
                js: ''
            };
        },
        created() {
            var _this = this;
            
            Event.$on('update_preview', function($event) {
                _this.updateData($event.data).updatePreview();
            });
        },
        computed: {
            csrfToken() {
                return window.Laravel.csrfToken;
            }
        },
        methods: {
            updateData($data) {
                for (var key in this.$data) {
                    this[key] = $data[key]
                }

                /*
                _.forEach(_this.$data, function(key, value) {
                    console.log(key);
                    console.log(value);
                    });
                 */

                return this;
            },
            updatePreview() {
                setTimeout(function() {
                    document.getElementById('preview-form').submit();
                }, 1000);
            }
        }
    }
</script>
