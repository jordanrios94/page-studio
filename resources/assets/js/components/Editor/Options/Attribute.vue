<template>
<div class="form-group">
    <label :for="name">{{ label }}</label>
    <input 
        type="text"
        :id="name"
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
