<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a href="#" :class="$parent.hasClasses('btn btn-primary', ['blockquote-reverse'])" @click="$parent.changeClass($event, '', 'reverse')">No</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'reverse')" @click="$parent.changeClass($event, 'reverse', 'reverse')">Yes</a>
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
