module.exports = {
    methods: {
        updateTree(tree) {
            let $tree;
            this.tree = tree;

            for (let i = 0; i < tree.length; i++) {
                let element = tree[i];

                const nodeName = element.localName || element.nodeName || element.name;
                const className = element.className ? '.' + element.className.replace(' ', '.') : '';

                const $list = $('<ul></ul>');
                const $item = $('<li></li>');
                const $text = $('<span></span>').text(nodeName + className).data('index', i);

                $text.on('click', e => {
                    e.preventDefault();
                    const index = $(e.currentTarget).data('index');
                    let tree = _.clone(this.tree);
                    this.updateTree(tree.slice(0, (index + 1)));
                });

                const $node = $list.append($item.append($text));

                if (!$tree) {
                    $tree = $list;
                } else {
                    $tree.find(this.getTreeSelector(i)).append($list);
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
};
