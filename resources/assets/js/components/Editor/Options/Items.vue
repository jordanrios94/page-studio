<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-vertical">
        <a href="#" class="btn btn-primary add-btn" @click="addItem($event, $store.state.html.listGroupItem)">Add List Group Item <span class="s7-plus"></span></a>
        <a href="#" class="btn btn-primary add-btn" @click="addItem($event, $store.state.html.listGroupLink)">Add List Group Link <span class="s7-plus"></span></a>
    </div>
    <div class="btn-group btn-group-vertical items-btn-group" v-sortable="{ onEnd: reorderItems, handle: '.btn-primary' }">
        <a href="#" class="btn btn-primary" v-for="item in $parent.element.items" @click="selectItem($event, item)">{{ item.type }} ({{ item.text }})</a>
    </div>
</div>
</template>
<script>
    export default {
        props: {
            label: {
                type: String,
                required: true
            }
        },
        methods: {
            reorderItems({oldIndex, newIndex}) {
                const siblings = $(this.$parent.element.item, this.$parent.elementNode);
                const subject = $(siblings.get(oldIndex));
                const object = $(siblings.get(newIndex));

                if (oldIndex > newIndex) {
                    subject.insertBefore(object);
                } else {
                    subject.insertAfter(object);
                }

                let clone = _.clone(this.$parent.element.items);
                const movedItem = clone.splice(oldIndex, 1)[0];
                this.$parent.element.items = [];

                setTimeout(() => {
                    clone.splice(newIndex, 0, movedItem);
                    this.$parent.element.items = clone;
                }, 1);
            },
            addItem(e, html) {
                e.preventDefault();

                const $item = $(html);
                this.$parent.elementNode.append($item);
                this.$parent.element.items.push({
                    text: $item.text(),
                    type: $item.prop('tagName').toLowerCase() === 'a' ? 'Link' : 'Item',
                    node: $item
                });
            },
            selectItem(e, item) {
                e.preventDefault();

                let path = _.clone(this.$parent.tree);
                const context = item.node.context || item.node[0];
                path.push(context);

                const click = $.Event('click', { 
                    triggerEvent: {
                        path: path.reverse()
                    }
                });

                item.node.trigger(click);
            }
        }
    }
</script>
