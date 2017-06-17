<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a href="#" :class="$parent.hasClasses('btn btn-primary', ['progress-bar-striped'])" @click="$parent.changeClass($event, '', 'progressBarStripes')">No</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'striped')" @click="$parent.changeClass($event, 'striped', 'progressBarStripes')">Yes</a>
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
