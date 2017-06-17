<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-vertical">
        <a href="#" :class="$parent.hasClasses('btn btn-primary', ['img-rounded','img-circle','img-thumbnail'])" @click="$parent.changeClass($event, '', 'image')">
            None
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'rounded')" @click="$parent.changeClass($event, 'rounded', 'image')">
            Rounded
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'circle')" @click="$parent.changeClass($event, 'circle', 'image')">
            Circle
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'thumbnail')" @click="$parent.changeClass($event, 'thumbnail', 'image')">
            Thumbnail
        </a>
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
