<template>
    <div :id="type" role="tabpanel" class="tab-pane announcement am-scroller nano">
        <div class="nano-content">
            <div class="content">
                <h2>{{ title }}</h2>
                <ul class="sources-list" v-sortable="{ onEnd: reorder, handle: '.s7-menu' }">
                    <li v-for="item in items" class="source-item">
                        <div class="icon left"><span class="icon s7-menu"></span></div>
                        <div class="content"><input type="text" :value="item.value" class="form-control input-xs" name="source" @change="update(item, $event)"></div>
                        <div class="icon right"><span class="icon s7-close" @click="remove(item)"></span></div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="search">
            <input type="text" :placeholder="placeholder" v-model="source" name="q"><span class="s7-plus" @click="add($event)"></span>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            placeholder: {
                required: true
            }
        },
        data() {
            return {
                source: ''
            };
        },
        computed: {
            items() {
                return this.$store.state[this.type];
            }
        },
        methods: {
            commit(mutation, item, value = '') {
                this.$store.commit(mutation, {
                    setting: this.type,
                    value: value,
                    index: this.items.indexOf(item)
                });
            },
            add($e) {
                this.commit('addSource', {}, this.source);
                this.source = '';
                Event.$emit('update_preview');
            },
            update(item, $e) {
                this.commit('updateSource', item, $e.currentTarget.value);
                Event.$emit('update_preview');
            },
            remove(item) {
                this.commit('removeSource', item, item.value);
                Event.$emit('update_preview');
            },
            reorder({oldIndex, newIndex}) {
                this.$store.dispatch('reorderSources', {
                    setting: this.type,
                    oldIndex: oldIndex,
                    newIndex: newIndex
                }).then(() => {
                    Event.$emit('update_preview');
                });
            }
        }
    }
</script>
