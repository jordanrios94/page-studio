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
            'selected': {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isActive: false
            };
        },
        created() {
            const vm = this;

            Event.$on('tab-selected', function ($event) {
                vm.isActive = (vm.type == $event.type);
            });
        },
        mounted() {
            this.isActive = this.selected;
            this.loadEditor();
        },
        computed: {
            divID() {
                return this.type + '-editor';
            },
            value() {
                return this.$store.state.page[this.type];
            }
        },
        methods: {
            broadcast() {
                Event.$emit('update_preview');
                Event.$emit('update_iframe_inline_block', {
                    type: this.type,
                    value: this.value
                });
            },
            update(value) {
                this.$store.commit('update', {
                    setting: this.type,
                    value: value
                });
            },
            loadEditor() {
                const vm = this;
                const editor = ace.edit(vm.divID);

                editor.commands.addCommand({
                    name: 'beautify',
                    exec: function() {
                        vm.beautify(editor);
                    },
                    bindKey: {mac: "cmd-p", win: "ctrl-p"}
                });

                editor.getSession().setMode(vm.mode);
                editor.getSession().setTabSize(2);
                editor.getSession().setUseSoftTabs(true);

                if (vm.value) {
                    editor.setValue(vm.value);
                    vm.broadcast();
                }

                editor.getSession().on('change', function() {
                    vm.update(editor.getValue());
                    vm.broadcast();
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
