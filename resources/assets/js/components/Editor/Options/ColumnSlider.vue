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
            }
        },
        data() {
            return {
                colWidth: [
                    'col-md-1','col-md-2','col-md-3','col-md-4','col-md-5','col-md-6',
                    'col-md-7','col-md-8','col-md-9','col-md-10','col-md-11','col-md-12'
                ],
                colOffset: [
                    'col-md-offset-0','col-md-offset-1','col-md-offset-2','col-md-offset-3','col-md-offset-4','col-md-offset-5','col-md-offset-6',
                    'col-md-offset-7','col-md-offset-8','col-md-offset-9','col-md-offset-10','col-md-offset-11','col-md-offset-12'
                ]
            };
        },
        created() {
            Event.$on('update_slider', $event => {
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
                        const style = (this.setting === 'colWidth' ? 'col-md-' : 'col-md-offset-') + newValue.toString();
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
                        const strStart = this.setting === 'colWidth' ? 7 : 14;
                        value = parseInt(this[this.setting][i].substr(strStart));
                        break;
                    }
                }

                return value;
            }
        }
    }
</script>
