<template>
    <div :id="type" role="tabpanel" class="tab-pane announcement am-scroller nano">
        <div class="nano-content">
            <div class="content">
                <h2>{{ title }}</h2>
                <ul class="sources-list" v-sortable="{ onEnd: reorder, handle: '.s7-menu' }">
                    <li class="source-item" v-for="item in items">
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
                return this.$store.state.page[this.type];
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
            broadcast() {
                EventBus.$emit('update_preview');
                EventBus.$emit('update_iframe_sources', {
                    type: this.type,
                    items: this.$store.state.page[this.type]
                });
            },
            add($e) {
                this.commit('addSource', {}, this.source);
                this.broadcast();
                this.source = '';
            },
            update(item, $e) {
                this.commit('updateSource', item, $e.currentTarget.value);
                this.broadcast();
            },
            remove(item) {
                this.commit('removeSource', item, item.value);
                this.broadcast();
            },
            reorder({oldIndex, newIndex}) {
                this.$store.dispatch('reorderSources', {
                    setting: this.type,
                    oldIndex: oldIndex,
                    newIndex: newIndex
                }).then(() => {
                    this.broadcast();
                });
            }
        }
    }
</script>
