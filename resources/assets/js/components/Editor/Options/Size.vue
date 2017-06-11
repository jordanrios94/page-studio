<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'xs')" @click="$parent.changeClass($event, 'xs', 'sizes')">xs</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'sm')" @click="$parent.changeClass($event, 'sm', 'sizes')">sm</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'md')" @click="$parent.changeClass($event, 'md', 'sizes')">md</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'lg')" @click="$parent.changeClass($event, 'lg', 'sizes')">lg</a>
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
