<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a href="#" :class="$parent.hasClasses('btn btn-primary', ['btn-block'])" @click="$parent.changeClass($event, '', 'btnWidth')">No</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'block')" @click="$parent.changeClass($event, 'block', 'btnWidth')">Yes</a>
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
