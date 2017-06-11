<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a href="#" :class="$parent.hasClasses('btn btn-primary', ['active'])" @click="$parent.changeClass($event, '', 'progressBarAnimation', '')">No</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'active', '')" @click="$parent.changeClass($event, 'active', 'progressBarAnimation', '')">Yes</a>
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
