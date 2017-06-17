<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a href="#" :class="$parent.hasClasses('btn btn-primary', ['img-responsive'])" @click="$parent.changeClass($event, '', 'responsive')">No</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'responsive')" @click="$parent.changeClass($event, 'responsive', 'responsive')">Yes</a>
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
