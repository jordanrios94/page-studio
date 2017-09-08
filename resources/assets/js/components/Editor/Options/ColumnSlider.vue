<template>
<div class="form-group">
    <label class="col-width-label control-label">{{ label }}</label>
    <input :id="id" type="text" :data-slider-min="min" data-slider-max="12" data-slider-step="1" class="col-slider form-control" />
</div>
</template>
<script>
    export default {
        props: {
            label: {
                type: String,
                required: true
            },
            setting: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
            min: {
                type: String,
                required: true
            },
            baseClass: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                colPhoneWidth: [
                    'col-xs-1','col-xs-2','col-xs-3','col-xs-4','col-xs-5','col-xs-6',
                    'col-xs-7','col-xs-8','col-xs-9','col-xs-10','col-xs-11','col-xs-12'
                ],
                colTabletWidth: [
                    'col-sm-1','col-sm-2','col-sm-3','col-sm-4','col-sm-5','col-sm-6',
                    'col-sm-7','col-sm-8','col-sm-9','col-sm-10','col-sm-11','col-sm-12'
                ],
                colLaptopWidth: [
                    'col-md-1','col-md-2','col-md-3','col-md-4','col-md-5','col-md-6',
                    'col-md-7','col-md-8','col-md-9','col-md-10','col-md-11','col-md-12'
                ],
                colDesktopWidth: [
                    'col-lg-1','col-lg-2','col-lg-3','col-lg-4','col-lg-5','col-lg-6',
                    'col-lg-7','col-lg-8','col-lg-9','col-lg-10','col-lg-11','col-lg-12'
                ],
                colPhoneOffset: [
                    'col-xs-offset-0','col-xs-offset-1','col-xs-offset-2','col-xs-offset-3','col-xs-offset-4','col-xs-offset-5','col-xs-offset-6',
                    'col-xs-offset-7','col-xs-offset-8','col-xs-offset-9','col-xs-offset-10','col-xs-offset-11','col-xs-offset-12'
                ],
                colTabletOffset: [
                    'col-sm-offset-0','col-sm-offset-1','col-sm-offset-2','col-sm-offset-3','col-sm-offset-4','col-sm-offset-5','col-sm-offset-6',
                    'col-sm-offset-7','col-sm-offset-8','col-sm-offset-9','col-sm-offset-10','col-sm-offset-11','col-sm-offset-12'
                ],
                colLaptopOffset: [
                    'col-md-offset-0','col-md-offset-1','col-md-offset-2','col-md-offset-3','col-md-offset-4','col-md-offset-5','col-md-offset-6',
                    'col-md-offset-7','col-md-offset-8','col-md-offset-9','col-md-offset-10','col-md-offset-11','col-md-offset-12'
                ],
                colDesktopOffset: [
                    'col-lg-offset-0','col-lg-offset-1','col-lg-offset-2','col-lg-offset-3','col-lg-offset-4','col-lg-offset-5','col-lg-offset-6',
                    'col-lg-offset-7','col-lg-offset-8','col-lg-offset-9','col-lg-offset-10','col-lg-offset-11','col-lg-offset-12'
                ]
            };
        },
        created() {
            EventBus.$on('update_slider', $event => {
                this.initSlider();
            });
        },
        mounted() {
            this.initSlider();
        },
        methods: {
            initSlider() {
                const $slider = $('#' + this.id);

                if ($slider.length) {
                    $slider.slider({
                        value: this.getValue()
                    }).on('change', $event => {
                        const newValue = $event.value.newValue;
                        const style = this.baseClass + newValue.toString();
                        this.$parent.changeClass($event, style, this.setting, '');
                    });

                    setTimeout(() => {
                        $slider.slider('setValue', this.getValue());
                    }, 1);
                }
            },
            getValue() {
                let value = 0;

                for (let i = 0; i < this[this.setting].length; i++) {
                    let className = this.$parent.elementNode.attr('class');

                    if (this.$parent.elementNode.hasClass(this[this.setting][i])) {
                        const strStart = ['colPhoneWidth', 'colTabletWidth', 'colLaptopWidth', 'colDesktopWidth'].includes(this.setting) ? 7 : 14;
                        value = parseInt(this[this.setting][i].substr(strStart));
                        break;
                    }
                }

                return value;
            }
        }
    }
</script>
