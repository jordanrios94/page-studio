<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a href="#" :class="$parent.hasClasses('btn btn-primary', ['active','disabled'])" @click="$parent.changeClass($event, '', 'btnState', '')">None</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'active', '')" @click="$parent.changeClass($event, 'active', 'btnState', '')">Active</a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'disabled', '')" @click="$parent.changeClass($event, 'disabled', 'btnState', '')">Disabled</a>
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
