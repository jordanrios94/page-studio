<template>
<aside class="page-aside right">
    <div class="am-scroller nano">
        <div class="nano-content" style="margin-right: 0px;">
        <div class="content">
            <p class="text-center" v-if="!element.name">No element has been selected.</p>
            <div v-show="element.name">
                <h2>DOM Tree</h2>
                    <div id="treeview" class="tree"></div>
                <hr>
            </div>
            <div v-if="element.name">
                <h2>{{ element.name }}</h2>
                <br>
                <form role="form">
                    <attribute-option label="ID" name="id" :value="element.id" @change="changeAttribute" v-if="editable.id"></attribute-option>
                    <attribute-option label="Class" name="class" :value="element.class" @change="changeAttribute" v-if="editable.class"></attribute-option>
                    <attribute-option label="Action" name="action" :value="element.action" @change="changeAttribute" v-if="editable.action"></attribute-option>
                    <attribute-option label="Source" name="src" :value="element.src" @change="changeAttribute" v-if="editable.src"></attribute-option>
                    <attribute-option label="Alt Text" name="alt" :value="element.alt" @change="changeAttribute" v-if="editable.alt"></attribute-option>
                    <attribute-option label="URL" name="href" :value="element.href" @change="changeAttribute" v-if="editable.href && element.tag === 'a'"></attribute-option>
                    <target-option label="Browser Target" v-if="editable.target"></target-option>
                    <size-option label="Size" v-if="editable.size"></size-option>
                    <btn-width-option label="Full Width" v-if="editable.btnWidth"></btn-width-option>
                    <state-option label="State" v-if="editable.state"></state-option>
                    <stripes-option label="Striped" v-if="editable.stripes"></stripes-option>
                    <active-option label="Animated" v-if="editable.active"></active-option>
                    <lead-option label="Lead" v-if="editable.lead"></lead-option>
                    <alignment-option label="Alignment" v-if="editable.alignment"></alignment-option>
                    <text-transform-option label="Transformation" v-if="editable.textTransform"></text-transform-option>
                    <reverse-option label="Reverse" v-if="editable.reverse"></reverse-option>
                    <option-style label="Style" v-if="editable.style"></option-style>
                    <responsive-option label="Responsive" v-if="editable.responsive"></responsive-option>
                    <image-option label="Style" v-if="editable.image"></image-option>
                    <items-option label="Items" v-if="editable.items"></items-option>
                </form>
            </div>
        </div>
    </div>
    <div class="nano-pane" style="display: none;"><div class="nano-slider" style="height: 902px; transform: translate(0px, 0px);"></div></div></div>
</aside>
</template>
<script>
    export default {
        components: {
            'active-option': require('./Options/Active.vue'),
            'alignment-option': require('./Options/Alignment.vue'),
            'attribute-option': require('./Options/Attribute.vue'),
            'btn-width-option': require('./Options/BtnWidth.vue'),
            'image-option': require('./Options/Image.vue'),
            'items-option': require('./Options/Items.vue'),
            'lead-option': require('./Options/Lead.vue'),
            'option-style': require('./Options/Style.vue'),
            'responsive-option': require('./Options/Responsive.vue'),
            'reverse-option': require('./Options/Reverse.vue'),
            'size-option': require('./Options/Size.vue'),
            'state-option': require('./Options/State.vue'),
            'stripes-option': require('./Options/Stripes.vue'),
            'target-option': require('./Options/Target.vue'),
            'text-transform-option': require('./Options/TextTransform.vue')
        },
        data() {
            return {
                tree: [],
                elementNode: null,
                element: {
                    name: '',
                    style: '',
                    tag: '',
                    item: '',
                    items: []
                },
                editable: {
                    id: false,
                    class: false,
                    style: false,
                    href: false,
                    btnWidth: false,
                    size: false,
                    target: false,
                    state: false,
                    stripes: false,
                    active: false,
                    lead: false,
                    alignment: false,
                    textTransform: false,
                    alt: false,
                    image: false,
                    responsive: false,
                    src: false,
                    reverse: false,
                    action: false,
                    items: false
                }
            };
        },
        watch: {
            elementNode($element) {
                const element = this.getElement($element);
                const attributes = ['id','class','href','target','src','alt','action'];

                this.element.name = element.name;
                this.element.style = element.style;
                this.element.tag = $element.prop('tagName').toLowerCase();
                this.element.item = element.item || '';
                this.element.items = [];

                for (let i in attributes) {
                    this.element[attributes[i]] = $element.attr(attributes[i]) || '';
                }

                for (let key in this.editable) {
                    this.editable[key] = element.editable.includes(key)
                }

                if (this.editable.items) {
                    $(this.element.item, $element).each((i, item) => {
                        const $item = $(item);
                        this.element.items.push({ 
                            text: $item.text(), 
                            type: $item.prop('tagName').toLowerCase() === 'a' ? 'Link' : 'Item',
                            node: $item
                        });
                    });
                }
                
                this.$forceUpdate();
            },
            tree(tree) {
                let copy = _.clone(tree);
                const element = copy.pop();
                this.elementNode = $(element);
            }
        },
        created() {
            const vm = this;

             Event.$on('update-aside', function ($event) {
                vm.updateTree($event.tree);
            });
        },
        methods: {
            hasAttribute(style, attribute, value) {
                return style + ((this.elementNode.attr(attribute) === value) ? ' active' : '');
            },
            hasClass(style, className, baseStyle = this.element.style) {
                const elementClass = baseStyle ? baseStyle + '-' + className : className;
                return style + (this.elementNode.hasClass(elementClass) ? ' active' : '');
            },
            hasClasses(style, classes) {
                let hasClass = false;
                
                classes.forEach(className => {
                    if (this.elementNode.hasClass(className)) {
                        hasClass = true;
                    }
                }, this);

                return style + (!hasClass ? ' active' : '');
            },
            changeAttribute({ name, value }) {
                this.elementNode.attr(name, value.trim());
                this.updateTree(_.clone(this.tree));
            },
            changeClass(e, chosenStyle, type, style = this.element.style) {
                e.preventDefault();
                const styles = {
                    standard: ['default','primary','success','info','warning','danger'],
                    alignment: ['left','center','right','justify','nowrap'],
                    sizes: ['xs','sm','md','lg'],
                    textTransform: ['lowercase','uppercase','capitalize'],
                    image: ['rounded','circle','thumbnail'],
                    btnWidth: ['block'],
                    btnState: ['active','disabled'],
                    progressBarAnimation: ['active'],
                    progressBarStripes: ['striped'],
                    responsive: ['responsive'],
                    reverse: ['reverse'],
                    lead: ['lead']
                };

                this.updateBootstrapClass(styles[type], style, chosenStyle);
            },
            updateBootstrapClass(classes, bootstrapClass, chosenClass) {
                bootstrapClass = (!_.isEmpty(bootstrapClass)) ? bootstrapClass + '-' : '';
                
                for (let i = 0; i < classes.length; i++) {
                    const className = bootstrapClass + classes[i];
                    this.elementNode.removeClass(className);
                }

                if (!_.isEmpty(chosenClass)){
                    this.elementNode.addClass(bootstrapClass + chosenClass);
                }

                this.updateTree(_.clone(this.tree));
            },
            updateTree(tree) {
                const vm = this;
                let $tree;
                this.tree = tree;

                for (let i = 0; i < tree.length; i++) {
                    let element = tree[i];

                    const nodeName = element.localName || element.nodeName || element.name;
                    const className = element.className ? '.' + element.className.replace(' ', '.') : '';

                    const $list = $('<ul></ul>');
                    const $item = $('<li></li>');
                    const $text = $('<span></span>').text(nodeName + className).data('index', i);

                    $text.on('click', function (e) {
                        e.preventDefault();
                        const index = $(this).data('index');
                        let tree = _.clone(vm.tree);
                        vm.updateTree(tree.slice(0, (index + 1)));
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
            },
            getElement($elem) {
                for (let index in this.$store.state.elements) {
                    if ($elem.hasClass(index) || $elem.prop('tagName') === index.toUpperCase()) {
                        return this.$store.state.elements[index];
                    }
                }
            }
        }
    }
</script>
