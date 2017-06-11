<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a href="#" :class="$parent.hasClasses('btn btn-primary', ['lead'])" @click="$parent.changeClass($event, '', 'lead', '')">No</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'lead', '')" @click="$parent.changeClass($event, 'lead', 'lead', '')">Yes</a>
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
