<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a  href="#"
            :class="$parent.hasAttribute('btn btn-primary', 'target', '_top')"
            class="btn btn-primary"
            @click="$parent.changeAttribute($event, 'target', '_top')">Current Tab</a>
        
        <a  href="#"
            :class="$parent.hasAttribute('btn btn-primary', 'target', '_blank')"
            @click="$parent.changeAttribute($event, 'target', '_blank')">New Tab</a>
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
