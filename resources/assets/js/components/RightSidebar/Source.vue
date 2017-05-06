<template>
    <div :id="type" role="tabpanel" class="tab-pane announcement am-scroller nano">
        <div class="nano-content">
            <div class="content">
                <h2>{{ title }}</h2>
                <ul class="sources-list" v-sortable="{ onEnd: reorder, handle: '.s7-menu' }">
                    <li v-for="item in items" class="source-item">
                        <div class="icon left"><span class="icon s7-menu"></span></div>
                        <div class="content"><input type="text" v-model="item.value" class="form-control input-xs" name="source" @change="updatePage"></div>
                        <div class="icon right"><span class="icon s7-close" @click="removeItem(item)"></span></div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="search">
            <input type="text" :placeholder="placeholder" v-model="source" name="q"><span class="s7-plus" @click="addItem($event)"></span>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                required: true
            },
            type: {
                required: true
            },
            placeholder: {
                required: true
            }
        },
        data() {
            return {
                items: [],
                source: ''
            };
        },
        mounted() {
            this.items = this.getItems();
        },
        methods: {
            getItems() {
                return window.Page ? JSON.parse(Page.data.page[this.type]) : [];
            },
            addItem($e) {
                const value = this.$el.querySelector('input[name="q"]').value;
                this.items.push({
                    value: value
                });
                this.source = '';
                this.updatePage();
            },
            removeItem(item) {
                this.items.splice(this.items.indexOf(item), 1);
                this.updatePage();
            },
            reorder({oldIndex, newIndex}) {
                const vm = this;
                let clone = _.clone(vm.items);
                const movedItem = clone.splice(oldIndex, 1)[0];
                vm.items = [];

                setTimeout(function() {
                    clone.splice(newIndex, 0, movedItem);
                    vm.items = clone;
                    vm.updatePage();
                }, 1);
            },
            updatePage() {
                Event.$emit('page_updated', {
                    setting: this.type,
                    value: this.items
                });
            }
        }
    }
</script>
