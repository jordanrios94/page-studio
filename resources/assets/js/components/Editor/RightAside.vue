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
                        <attribute-option label="ID" name="id" :value="element.id" v-if="editable.id"></attribute-option>
                        <attribute-option label="Class" name="class" :value="element.class" v-if="editable.class"></attribute-option>
                        <attribute-option label="Action" name="action" :value="element.action" v-if="editable.action"></attribute-option>
                        <attribute-option label="Source" name="src" :value="element.src" v-if="editable.src"></attribute-option>
                        <attribute-option label="Alt Text" name="alt" :value="element.alt" v-if="editable.alt"></attribute-option>
                        <attribute-option label="URL" name="href" :value="element.href" v-if="editable.href && element.tag === 'a'"></attribute-option>
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
                        <div class="panel panel-default panel-transparent panel-borders" v-if="editable.colWidth">
                            <div class="panel-heading">
                                <span class="title">Width</span>
                            </div>
                            <div class="panel-body">
                                <column-slider-option id="col-phone-width" label="Phone" setting="colPhoneWidth" baseClass="col-xs-" min="1" v-if="editable.colWidth"></column-slider-option>
                                <column-slider-option id="col-tablet-width" label="Tablet" setting="colTabletWidth" baseClass="col-sm-" min="1" v-if="editable.colWidth"></column-slider-option>
                                <column-slider-option id="col-laptop-width" label="Laptop" setting="colLaptopWidth" baseClass="col-md-" min="1" v-if="editable.colWidth"></column-slider-option>
                                <column-slider-option id="col-desktop-width" label="Desktop" setting="colDesktopWidth" baseClass="col-lg-" min="1" v-if="editable.colWidth"></column-slider-option>
                            </div>
                        </div>
                        <div class="panel panel-default panel-transparent panel-borders" v-if="editable.colOffset">
                            <div class="panel-heading">
                                <span class="title">Offset</span>
                            </div>
                            <div class="panel-body">
                                <column-slider-option id="col-phone-offset" label="Phone" setting="colPhoneOffset" baseClass="col-xs-offset-" min="0" v-if="editable.colOffset"></column-slider-option>
                                <column-slider-option id="col-tablet-offset" label="Tablet" setting="colTabletOffset" baseClass="col-sm-offset-" min="0" v-if="editable.colOffset"></column-slider-option>
                                <column-slider-option id="col-laptop-offset" label="Laptop" setting="colLaptopOffset" baseClass="col-md-offset-" min="0" v-if="editable.colOffset"></column-slider-option>
                                <column-slider-option id="col-desktop-offset" label="Desktop" setting="colDesktopOffset" baseClass="col-lg-offset-" min="0" v-if="editable.colOffset"></column-slider-option>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="nano-pane" style="display: none;">
            <div class="nano-slider" style="height: 902px; transform: translate(0px, 0px);"></div>
        </div>
    </div>
</aside>
</template>
<script>
    export default {
        components: {
            'active-option': require('./Options/Active.vue'),
            'alignment-option': require('./Options/Alignment.vue'),
            'attribute-option': require('./Options/Attribute.vue'),
            'btn-width-option': require('./Options/BtnWidth.vue'),
            'column-slider-option': require('./Options/ColumnSlider.vue'),
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
                editable: {}
            };
        },
        mixins: [
            require('./../../mixins/editor/options.js'),
            require('./../../mixins/editor/tree.js')
        ],
        watch: {
            elementNode($element) {
                const element = this.getElement($element);
                const attributes = ['id','class','href','target','src','alt','action'];
                const editable = [
                    'id','class','style','href','btnWidth','size','target',
                    'state','stripes','active','lead','alignment', 'textTransform',
                    'alt','image','responsive','src','reverse','action','items','colWidth',
                    'colOffset'
                ];

                this.element.name = element.name;
                this.element.style = element.style;
                this.element.tag = $element.prop('tagName').toLowerCase();
                this.element.item = element.item || '';
                this.element.items = [];

                for (let i in attributes) {
                    this.element[attributes[i]] = $element.attr(attributes[i]) || '';
                }

                for (let i in editable) {
                    this.editable[editable[i]] = element.editable.includes(editable[i]);
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
                this.broadcast();
            },
            tree(tree) {
                let copy = _.clone(tree);
                const element = copy.pop();
                this.elementNode = $(element);
            }
        },
        created() {
            EventBus.$on('update-aside', $event => {
                this.updateTree($event.tree);
            });
        },
        methods: {
            broadcast() {
                if (this.element.name === 'Column') EventBus.$emit('update_slider');
                EventBus.$emit('update_iframe_html');
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
