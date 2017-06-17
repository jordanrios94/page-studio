<template>
<div class="form-group">
    <label>{{ label }}</label>
    <input 
        type="text"
        class="form-control"
        :name="name"
        v-bind:value="value"
        @change="$parent.changeAttribute($event, $event.currentTarget.name, $event.currentTarget.value)" />
</div>
</template>
<script>
    export default {
        props: {
            label: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    }
</script>
