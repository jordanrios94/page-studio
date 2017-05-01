<template>
    <div :id="type" role="tabpanel" class="tab-pane announcement am-scroller nano">
        <div class="nano-content">
            <div class="content">
                <h2>{{ title }}</h2>
                <ul class="sources-list">
                    <li v-for="item in items" class="source-item">
                        <div class="icon left"><span class="icon s7-menu"></span></div>
                        <div class="content"><input type="text" v-model="item.value" class="form-control input-xs" name="source"></div>
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
            this.reorderItems();
        },
        methods: {
            getItems() {
                return Page ? JSON.parse(Page.data.page[this.type]) : [];
            },
            addItem($e) {
                const value = this.$el.querySelector('input[name="q"]').value;

                this.items.push({
                    value: value
                });

                this.source = '';
            },
            removeItem(item) {
                this.items.splice(this.items.indexOf(item), 1);
            },
            reorderItems() {
                let vm = this;

                $('#' + this.type).find('.sources-list').sortable({
                    handle: '.s7-menu',
                    axis: 'y',
                    containment: 'parent',
                    stop: function(e, ui) {
                        const $items = $(this).find('.source-item');
                        const items = [];

                        $items.each(function (index, element) {
                             items.push({
                                 value: $(element).find('input[name="source"]').val()
                             });
                        });

                        // TODO: FIX - NOT WORKING
                        //vm.items =  items;
                    }
                });
            }
        }
    }
</script>
