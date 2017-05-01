<template>
    <li :class="className">
        <a href="#" @click="selectTab"><i :class="icon"></i><span><slot></slot></span></a>
    </li>
</template>
<script>
    export default {
        props: {
            icon: {
                required: true
            },
            type: {
                required: true
            },
            selected: {
                default: false
            }
        },
        data() {
            return {
                isActive: false
            };
        },
        mounted() {
            this.isActive = this.selected;
        },
        computed: {
            className() {
                return this.isActive ? 'parent active' : 'parent';
            }
        },
        methods: {
            selectTab($event) {
                $event.preventDefault();
                Event.$emit('editor-selected', {
                    type: this.type
                });
                this.$parent.updateTabs(this);
            }
        }
    }
</script>
