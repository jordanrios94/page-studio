<template>
    <div class="panel panel-default">
        <div class="panel-heading primary">
            <h4 class="panel-title">
                <a data-toggle="collapse" :data-parent="parentId" :href="href" class="collapsed" aria-expanded="false"><i class="icon s7-angle-down"></i> {{ title }}</a>
            </h4>
        </div>
        <div :id="id" class="panel-collapse collapse" aria-expanded="false">
            <div class="list-group">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            }
        },
        computed: {
            parentId() {
                return '#' + this.$parent.id;
            },
            href() {
                return '#' + this.id;
            }
        }
    }
</script>
