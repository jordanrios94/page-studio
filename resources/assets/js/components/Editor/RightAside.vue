<template>
<aside class="page-aside right">
    <div class="am-scroller nano">
        <div class="nano-content" style="margin-right: 0px;">
        <div class="content">
            <h2>Tree</h2>
            <div id="treeview" class="tree"></div>
            <hr>

            <div v-if="element.name">
                <h2>{{ element.name }}</h2>
                <br>
                <form role="form">

                    <div class="form-group" v-if="editable.id">
                        <label>ID</label>
                        <input 
                            type="text"
                            class="form-control"
                            name="id"
                            :value="element.id"
                            @change="changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)">
                    </div>

                    <div class="form-group"  v-if="editable.id">
                        <label>Class</label>
                        <input
                            type="text"
                            class="form-control"
                            name="class"
                            :value="element.class"
                            @change="changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)">
                    </div>

                    <div class="form-group"  v-if="editable.href">
                        <label>URL</label>
                        <input
                            type="text"
                            class="form-control"
                            name="href"
                            :value="element.href"
                            @change="changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)">
                    </div>

                    <div class="form-group" v-if="editable.target">
                        <label>Browser Target</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasAttribute('btn btn-primary', 'target', '_top')" class="btn btn-primary" @click="changeAttribute($event, 'target', '_top')">Current Tab</a>
                            <a href="#" :class="hasAttribute('btn btn-primary', 'target', '_blank')" @click="changeAttribute($event, 'target', '_blank')">New Tab</a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.size">
                        <label>Size</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasClass('btn btn-primary', 'xs')" @click="changeClass($event, 'xs', 'sizes')">xs</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'sm')" @click="changeClass($event, 'sm', 'sizes')">sm</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'md')" @click="changeClass($event, 'md', 'sizes')">md</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'lg')" @click="changeClass($event, 'lg', 'sizes')">lg</a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.btnWidth">
                        <label>Full Width</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasClasses('btn btn-primary', ['btn-block'])" @click="changeClass($event, '', 'btnWidth')">No</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'block')" @click="changeClass($event, 'block', 'btnWidth')">Yes</a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.state">
                        <label>State</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasClasses('btn btn-primary', ['active','disabled'])" @click="changeClass($event, '', 'btnState', '')">None</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'active', '')" @click="changeClass($event, 'active', 'btnState', '')">Active</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'disabled', '')" @click="changeClass($event, 'disabled', 'btnState', '')">Disabled</a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.stripes">
                        <label>Striped</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasClasses('btn btn-primary', ['progress-bar-striped'])" @click="changeClass($event, '', 'progressBarStripes')">No</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'striped')" class="btn btn-primary" @click="changeClass($event, 'striped', 'progressBarStripes')">Yes</a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.active">
                        <label>Animated</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasClasses('btn btn-primary', ['active'])" @click="changeClass($event, '', 'progressBarAnimation', '')">No</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'active', '')" @click="changeClass($event, 'active', 'progressBarAnimation', '')">Yes</a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.lead">
                        <label>Lead</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasClasses('btn btn-primary', ['lead'])" @click="changeClass($event, '', 'lead', '')">No</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'lead', '')" @click="changeClass($event, 'lead', 'lead', '')">Yes</a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.alignment">
                        <label>Alignment</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasClass('btn btn-primary', 'left')" @click="changeClass($event, 'left', 'alignment')">
                                <span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'center')" @click="changeClass($event, 'center', 'alignment')">
                                <span class="glyphicon glyphicon-align-center" aria-hidden="true"></span>
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'right')" @click="changeClass($event, 'right', 'alignment')">
                                <span class="glyphicon glyphicon-align-right" aria-hidden="true"></span>
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'justify')" @click="changeClass($event, 'justify', 'alignment')">
                                <span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'nowrap')" @click="changeClass($event, 'nowrap', 'alignment')">
                                <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
                            </a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.textTransform">
                        <label>Transformation</label>
                        <div class="btn-group btn-group-vertical">
                            <a href="#" :class="hasClasses('btn btn-primary', ['text-lowercase','text-uppercase','text-capitalize'])" @click="changeClass($event, '', 'textTransform')">
                                None
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'lowercase')" @click="changeClass($event, 'lowercase', 'textTransform')">
                                Lowercase
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'uppercase')" @click="changeClass($event, 'uppercase', 'textTransform')">
                                Uppercase
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'capitalize')" @click="changeClass($event, 'capitalize', 'textTransform')">
                                Capitalize
                            </a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.style">
                        <label>Style</label>
                        <div class="btn-group btn-group-vertical">
                            <a href="#" :class="hasClass('btn btn-default', 'default')"  @click="changeClass($event, 'default', 'standard')">None</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'primary')"  @click="changeClass($event, 'primary', 'standard')">Primary</a>
                            <a href="#" :class="hasClass('btn btn-success', 'success')"  @click="changeClass($event, 'success', 'standard')">Success</a>
                            <a href="#" :class="hasClass('btn btn-info', 'info')"  @click="changeClass($event, 'info', 'standard')">Info</a>
                            <a href="#" :class="hasClass('btn btn-warning', 'warning')" @click="changeClass($event, 'warning', 'standard')">Warning</a>
                            <a href="#" :class="hasClass('btn btn-danger', 'danger')" @click="changeClass($event, 'danger', 'standard')">Danger</a>
                            
                        </div>
                    </div>

                </form>
            </div>



        </div>
    </div>
    <div class="nano-pane" style="display: none;"><div class="nano-slider" style="height: 902px; transform: translate(0px, 0px);"></div></div></div>
</aside>
</template>
<script>
    export default {
        data() {
            return {
                tree: [],
                elementNode: null,
                element: {
                    name: '',
                    style: '',
                    id: '',
                    class: '',
                    href: '',
                    target: ''
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
                    textTransform: false
                }
            };
        },
        watch: {
            elementNode($element) {
                const element = this.getElement($element);
                const attributes = ['id','class','href','target'];

                this.element.name = element.name;
                this.element.style = element.style;

                for (let i in attributes) {
                    this.element[attributes[i]] = $element.attr(attributes[i]) || '';
                }

                for (let key in this.editable) {
                    this.editable[key] = element.editable.includes(key)
                }
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
            hasClasses(style, classes) {
                let hasClass = false;

                classes.forEach(className => {
                    if (this.elementNode.hasClass(className)) {
                        hasClass = true;
                    }
                }, this);

                return style + (!hasClass ? ' active' : '');
            },
            hasClass(style, className, baseStyle = this.element.style) {
                const elementClass = baseStyle ? baseStyle + '-' + className : className;
                return style + (this.elementNode.hasClass(elementClass) ? ' active' : '');
            },
            changeAttribute(e, name, value) {
                e.preventDefault();
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
                    btnWidth: ['block'],
                    btnState: ['active','disabled'],
                    progressBarAnimation: ['active'],
                    progressBarStripes: ['striped'],
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
                let $tree;
                this.tree = tree;

                for (let i = 0; i < tree.length; i++) {
                    let element = tree[i];

                    const nodeName = element.localName || element.nodeName || element.name;
                    const className = element.className ? '.' + element.className.replace(' ', '.') : '';

                    const $list = $('<ul></ul>');
                    const $item = $('<li></li>');
                    const $text = $('<span></span>').text(nodeName + className);

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
                const elements = {
                    alert: { name: 'Alert', style: 'alert', editable: ['id','class','style'] },
                    dropdown: { name: 'Dropdown', editable: ['id','class'] },
                    btn: { name: 'Button', style: 'btn', editable: ['id','class','style','href','btnWidth','size','target','state'] },
                    'btn-group': { name: 'Button Group', editable: ['id','class'] },
                    panel: { name: 'Panel', editable: ['id','class'] },
                    jumbotron: { name: 'Jumbotron', editable: ['id','class'] },
                    breadcrumb: { name: 'Breadcrumb', editable: ['id','class'] },
                    caption: { name: 'Caption', editable: ['id','class'] },
                    thumbnail: { name: 'Thumbnail', editable: ['id','class'] },
                    'list-group': { name: 'List Group', editable: ['id','class'] },
                    'list-group-item': { name: 'List Group Item', editable: ['id','class'] },
                    'page-header': { name: 'Page Header', editable: ['id','class'] },
                    'panel-heading': { name: 'Panel Heading', editable: ['id','class'] },
                    'panel-body': { name: 'Panel Body', editable: ['id','class'] },
                    'progress-bar': { name: 'Progress Bar', style: 'progress-bar', editable: ['id','class','style','stripes','active'] },
                    h1: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h2: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h3: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h4: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h5: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h6: { name:'Heading', style:'text', editable:['id','class','style'] },
                    img: { name:'Image', editable:['id','class'] },
                    p: { name:'Paragraph', style: 'text', editable:['id','class','style','lead','alignment','textTransform'] },
                    ul: { name:'Unordered List', editable:['id','class'] },
                    ol: { name:'Ordered List', editable: ['id','class'] },
                    li: { name:'List Item', style:'text', editable:['id','class','style'] },
                    a: { name: 'Link', style:'text', editable: ['id','class','style'] },
                    div: { name: 'Div', editable: ['id','class'] },
                    blockquote: { name:'Blockquote', editable: ['id','class'] },
                    footer: { name:'Footer', editable: ['id','class'] },
                    small: { name:'Small', style:'text', editable:['id','class','style'] }
                };

                for (let index in elements) {
                    if ($elem.hasClass(index) || $elem.prop('tagName') === index.toUpperCase()) {
                        return elements[index];
                    }
                }
            }
        }
    }
</script>
