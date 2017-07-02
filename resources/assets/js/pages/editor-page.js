window._ = require('lodash');
window.$ = window.jQuery = require('jquery');

const getHtml = function () {
    const $body = $('body').clone();
    $body.find('.mce-tinymce').remove();
    $body.find('.mce-widget').remove();
    $body.find('[data-dragcontext-marker]').remove();

    return $body.html();
};

const editor = tinymce.init({
    selector: 'body',
    theme: 'inlite',
    verify_html : false,
    inline_styles : true,
    plugins: 'link paste textpattern',
    selection_toolbar: 'bold italic | h1 h2 h3 h4 h5 blockquote',
    inline: true,
    paste_block_drop: true,
    custom_undo_redo_levels: 10,
    init_instance_callback(editor) {
        window.parent.Event.$emit('update_html', {
            value: getHtml()
        });
    },
    setup(editor) {
        editor.on('BeforeAddUndo', e => {
            return false;
        });

        editor.on('NodeChange', e => {
            window.parent.Event.$emit('update_html', {
                value: getHtml()
            });
        });

        editor.on('keyup', e => {
            window.parent.Event.$emit('update_html', {
                value: getHtml()
            });
        });

        window.parent.Event.$on('update_iframe_html', $event => {
            window.parent.Event.$emit('update_html', {
                value: getHtml()
            });
        });
    }
});

const removeSources = function ({ type }) {
    $('.items-' + type).remove();
};

const addSources = function ({type, items}) {
    if (type === 'styles') {
        items.forEach(function(item) {
            const $link = $('<link/>');
            $link.attr('rel', 'stylesheet');
            $link.attr('type', 'text/css');
            $link.attr('href', item.value);
            $link.attr('class', 'items-' + type);
            $('[data-block="css"]').before($link);
        }, this);
    }
};

const updateInlineBlock = _.debounce($event => {
    $('[data-block="' + $event.type + '"]').html($event.value)
}, 1000);

window.parent.Event.$on('update_iframe_sources', $event => {
    removeSources($event);
    addSources($event);
});

window.parent.Event.$on('update_iframe_inline_block', updateInlineBlock);
