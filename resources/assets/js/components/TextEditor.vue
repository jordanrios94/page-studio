<template>
    <div :id="divID" class="ace-container" v-show="isActive"></div>
</template>

<script>
    export default {
        props: {
            'type': {
                type: String
            },
            'mode': {
                type: String
            },
            'init-value': {
                type: String
            },
            'selected': {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                value: '',
                isActive: false
            };
        },
        created() {
            let _this = this;
            _this.value = atob(this.initValue);

            Event.$on('editor-selected', function ($event) {
                _this.isActive = (_this.type == $event.type);
            });
        },
        mounted() {
            this.isActive = this.selected;
            this.loadEditor();
        },
        computed: {
            divID() {
                return this.type + '-editor';
            }
        },
        methods: {
            loadEditor() {
                const _this = this;
                const editor = ace.edit(_this.divID);

                editor.commands.addCommand({
                    name: 'beautify',
                    exec: function() {
                        _this.beautify(editor);
                    },
                    bindKey: {mac: "cmd-p", win: "ctrl-p"}
                });

                editor.getSession().setMode(_this.mode);
                editor.getSession().setTabSize(2);
                editor.getSession().setUseSoftTabs(true);

                if (_this.value) {
                    editor.setValue(_this.value);
                    Event.$emit('editor_updated', _this);
                }

                editor.getSession().on('change', function() {
                    _this.value = editor.getValue();
                    Event.$emit('editor_updated', _this);
                });
            },
            beautify(editor) {
                let uglyCode = editor ? editor.getValue() : '';
                switch(this.type) {
                    case 'js':
                        var sexyCode = beautify_js(uglyCode);
                        break;
                    case 'css':
                        var sexyCode = beautify_css(uglyCode);
                        break;
                    case 'html':
                        var sexyCode = beautify_html(uglyCode, {
                            'indent_size': 2
                        });
                        break;
                }
                editor.setValue(sexyCode);
            }
        }
    }
</script>
