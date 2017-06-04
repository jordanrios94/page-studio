<template>
<aside class="page-aside right">
    <div class="am-scroller nano">
        <div class="nano-content" style="margin-right: 0px;">
        <div class="content">
            <h2>Tree</h2>
            <div id="treeview" class="tree"></div>
            <hr>
            <h2>Component Setting</h2>
            <p>This is the section that will update itself as the page elements are selected.</p>
        </div>
    </div>
    <div class="nano-pane" style="display: none;"><div class="nano-slider" style="height: 902px; transform: translate(0px, 0px);"></div></div></div>
</aside>
</template>
<script>
    export default {
        created() {
            const vm = this;

             Event.$on('update-tree', function ($event) {
                vm.updateTree($event.tree);
            });
        },
        methods: {
            updateTree(tree) {
                const vm = this;
                let $tree;

                for (let i = 0; i < tree.length; i++) {
                    let element = tree[i];

                    const nodeName = element.localName || element.nodeName || element.name;
                    const className = element.className ? '.' + element.className : '';

                    const $list = $('<ul></ul>');
                    const $item = $('<li></li>');
                    const $text = $('<span></span>').text(nodeName + className);

                    const $node = $list.append($item.append($text));

                    if (!$tree) {
                        $tree = $list;
                    } else {
                        $tree.find(vm.getTreeSelector(i)).append($list);
                    }
                }

                $('#treeview').html('').append($tree);
            },
            getTreeSelector(treeIndex) {
                let selector = [];

                for (let i = 0; i < treeIndex; i++) {
                    if (i === 0) {
                        selector.push('li');
                    } else {
                        selector.push('> ul > li');
                    }
                }

                return selector.join(' ');
            }
        }
    }
</script>
