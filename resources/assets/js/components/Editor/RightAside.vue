<template>
<aside class="page-aside right">
    <div class="am-scroller nano">
        <div class="nano-content" style="margin-right: 0px;">
        <div class="content">

            <div v-if="!element.name">
                <p class="text-center">No element has been selected.</p>
            </div>

            <div v-show="element.name">
            <h2>Tree</h2>
                <div id="treeview" class="tree"></div>
            <hr>
            </div>

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
                            @change="changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)" />
                    </div>

                    <div class="form-group"  v-if="editable.id">
                        <label>Class</label>
                        <input
                            type="text"
                            class="form-control"
                            name="class"
                            :value="element.class"
                            @change="changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)" />
                    </div>

                    <div class="form-group"  v-if="editable.action">
                        <label>Action</label>
                        <input
                            type="text"
                            class="form-control"
                            name="action"
                            :value="element.action"
                            @change="changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)" />
                    </div>

                    <div class="form-group"  v-if="editable.src">
                        <label>Source</label>
                        <input
                            type="text"
                            class="form-control"
                            name="src"
                            :value="element.src"
                            @change="changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)" />
                    </div>

                    <div class="form-group"  v-if="editable.alt">
                        <label>Alt Text</label>
                        <input
                            type="text"
                            class="form-control"
                            name="alt"
                            :value="element.alt"
                            @change="changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)" />
                    </div>

                    <div class="form-group"  v-if="editable.href && element.tag === 'a'">
                        <label>URL</label>
                        <input
                            type="text"
                            class="form-control"
                            name="href"
                            :value="element.href"
                            @change="changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)" />
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
                            <a href="#" :class="hasClass('btn btn-primary', 'text-left', '')" @click="changeClass($event, 'left', 'alignment', 'text')">
                                <span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'text-center', '')" @click="changeClass($event, 'center', 'alignment', 'text')">
                                <span class="glyphicon glyphicon-align-center" aria-hidden="true"></span>
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'text-right', '')" @click="changeClass($event, 'right', 'alignment', 'text')">
                                <span class="glyphicon glyphicon-align-right" aria-hidden="true"></span>
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'text-justify', '')" @click="changeClass($event, 'justify', 'alignment', 'text')">
                                <span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'text-nowrap', '')" @click="changeClass($event, 'nowrap', 'alignment', 'text')">
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

                    <div class="form-group" v-if="editable.reverse">
                        <label>Reverse</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasClasses('btn btn-primary', ['blockquote-reverse'])" @click="changeClass($event, '', 'reverse')">No</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'reverse')" @click="changeClass($event, 'reverse', 'reverse')">Yes</a>
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

                    <div class="form-group" v-if="editable.responsive">
                        <label>Responsive</label>
                        <div class="btn-group btn-group-justified">
                            <a href="#" :class="hasClasses('btn btn-primary', ['img-responsive'])" @click="changeClass($event, '', 'responsive')">No</a>
                            <a href="#" :class="hasClass('btn btn-primary', 'responsive')" @click="changeClass($event, 'responsive', 'responsive')">Yes</a>
                        </div>
                    </div>

                    <div class="form-group" v-if="editable.imgStyle">
                        <label>Style</label>
                        <div class="btn-group btn-group-vertical">
                            <a href="#" :class="hasClasses('btn btn-primary', ['img-rounded','img-circle','img-thumbnail'])" @click="changeClass($event, '', 'imgStyle')">
                                None
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'rounded')" @click="changeClass($event, 'rounded', 'imgStyle')">
                                Rounded
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'circle')" @click="changeClass($event, 'circle', 'imgStyle')">
                                Circle
                            </a>
                            <a href="#" :class="hasClass('btn btn-primary', 'thumbnail')" @click="changeClass($event, 'thumbnail', 'imgStyle')">
                                Thumbnail
                            </a>
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
                    tag: ''
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
                    imgStyle: false,
                    responsive: false,
                    src: false,
                    reverse: false,
                    action: false
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
                    imgStyle: ['rounded','circle','thumbnail'],
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
                const elements = {
                    alert: { name:'Alert', style:'alert', editable:['id','class','style'] },
                    dropdown: { name:'Dropdown', editable:['id','class'] },
                    btn: { name:'Button', style: 'btn', editable:['id','class','style','href','btnWidth','size','target','state'] },
                    'btn-group': { name:'Button Group', editable:['id','class'] },
                    panel: { name:'Panel', style:'panel', editable:['id','class','style','alignment'] },
                    jumbotron: { name:'Jumbotron', editable:['id','class'] },
                    breadcrumb: { name:'Breadcrumb', editable:['id','class'] },
                    caption: { name:'Caption', editable:['id','class'] },
                    thumbnail: { name:'Thumbnail', editable:['id','class'] },
                    'list-group': { name:'List Group', style:'text', editable:['id','class','style','alignment'] },
                    'list-group-item': { name:'List Group Item', style:'list-group-item', editable:['id','class','style','href','state'] },
                    'page-header': { name:'Page Header', editable:['id','class'] },
                    'panel-heading': { name:'Panel Heading', style:'text', editable:['id','class'] },
                    'panel-body': { name:'Panel Body', style:'text', editable:['id','class','style'] },
                    'panel-footer': { name:'Panel Footer', style:'text', editable:['id','class','style'] },
                    'progress-bar': { name:'Progress Bar', style:'progress-bar', editable:['id','class','style','stripes','active'] },
                    h1: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h2: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h3: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h4: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h5: { name:'Heading', style:'text', editable:['id','class','style'] },
                    h6: { name:'Heading', style:'text', editable:['id','class','style'] },
                    img: { name:'Image', style:'img', editable:['id','class','src','alt','imgStyle','responsive'] },
                    p: { name:'Paragraph', style:'text', editable:['id','class','style','lead','alignment','textTransform'] },
                    ul: { name:'Unordered List', editable:['id','class'] },
                    ol: { name:'Ordered List', editable:['id','class'] },
                    li: { name:'List Item', style:'text', editable:['id','class','style'] },
                    a: { name:'Link', style:'text', editable:['id','class','style'] },
                    div: { name:'Div', editable:['id','class'] },
                    blockquote: { name:'Blockquote', style:'blockquote', editable:['id','class','reverse'] },
                    footer: { name:'Footer', style:'text', editable:['id','class','style'] },
                    small: { name:'Small', style:'text', editable:['id','class','style'] },
                    body: { name:'Body', editable:['id','class'] },
                    span: { name:'Span', editable:['id','class'] },
                    input: { name:'Input', editable:['id','class'] },
                    form: { name:'Form', editable:['id','class','action'] },
                    label: { name:'Label', editable:['id','class'] },
                    legend: { name:'Legend', editable:['id','class'] }
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
