<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-vertical">
        <a href="#" :class="$parent.hasClass('btn btn-default', 'default')" @click="$parent.changeClass($event, 'default', 'standard')">None</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'primary')" @click="$parent.changeClass($event, 'primary', 'standard')">Primary</a>
        <a href="#" :class="$parent.hasClass('btn btn-success', 'success')" @click="$parent.changeClass($event, 'success', 'standard')">Success</a>
        <a href="#" :class="$parent.hasClass('btn btn-info', 'info')" @click="$parent.changeClass($event, 'info', 'standard')">Info</a>
        <a href="#" :class="$parent.hasClass('btn btn-warning', 'warning')" @click="$parent.changeClass($event, 'warning', 'standard')">Warning</a>
        <a href="#" :class="$parent.hasClass('btn btn-danger', 'danger')" @click="$parent.changeClass($event, 'danger', 'standard')">Danger</a>
    </div>
</div>
</template>
<script>
    export default {
        props: {
            label: {
                type: String,
                required: true
            }
        }
    }
</script>
