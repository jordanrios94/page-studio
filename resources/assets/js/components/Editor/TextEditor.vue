<template>
    <div class="editor-container">
        <textarea :id="divID" class="editor-textarea"></textarea>
    </div>
</template>
<script>
    export default {
        props: {
            'initType': {
                type: String,
                default: 'html'
            },
            'initMode': {
                type: String,
                default: 'htmlmixed'
            },
            'selected': {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                type: 'html',
                isActive: false,
                editor: {}
            };
        },
        created() {
            const vm = this;

            // TODO: ON SELECTED DO NOT REMOVE ACTIVE, UPDATE SAME EDITOR
            // UPDATE THIS TYPE
            EventBus.$on('tab-selected', function ($event) {
                console.log($event);
                vm.type = $event.type;
                vm.isActive = (vm.type == $event.type);


                vm.updateEditor();
            });
        },
        mounted() {
            this.isActive = this.selected;
            this.type = this.initType;
            this.mode = this.initMode;

            //this.loadEditor();
            this.loadEditor();
            //this.broadcast();
        },
        computed: {
            // DON'T THINK I NEED THIS
            divID() {
                return 'master-editor';
            },
            value() {
                return this.$store.state.page[this.type];
            }
        },
        methods: {
            broadcast() {
                EventBus.$emit('update_preview');
                EventBus.$emit('update_iframe_inline_block', {
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
            updateEditor() {
                console.log(this.type);
                console.log(this.editor);


                this.editor.setValue(this.value);
                this.editor.setOption('mode', this.mode);
            },
            loadEditor() {
                const vm = this;

                const editor = this.editor = CodeMirror.fromTextArea(document.getElementById(this.divID), {
                    mode:  vm.mode,
                    matchBrackets: true,
                    styleActiveLine: true,
                    lineNumbers: true,
                    theme: 'neat'
                });

                if (vm.value) {
                    editor.setValue(vm.value);
                    vm.broadcast();
                }

                editor.on('change', function (instance, change) {
                    vm.update(editor.getValue());
                    vm.broadcast();
                });

                editor.addKeyMap({
                    'Ctrl-P': function() {
                        vm.beautify(editor);
                    },
                    'Cmd-P': function() {
                        vm.beautify(editor);
                    },
                });
            },
            loadEditorOld() {
                const vm = this;
                const editor = ace.edit(vm.divID);

                editor.commands.addCommand({
                    name: 'beautify',
                    exec() {
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

                switch (this.type) {
                    case 'js':
                        var sexyCode = beautify_js(uglyCode);
                        break;
                    case 'css':
                        var sexyCode = beautify_css(uglyCode);
                        break;
                    case 'html':
                        var sexyCode = beautify_html(uglyCode, {
                            'indent_size': 4
                        });
                        break;
                }

                editor.setValue(sexyCode);
            }
        }
    }
</script>
