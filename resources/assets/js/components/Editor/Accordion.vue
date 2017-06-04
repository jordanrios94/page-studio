<template>
    <div :id="id" class="panel-group accordion accordion-semi">
        <slot></slot>
    </div>
</template>
<script>
    export default {
        props: {
            id: {
                type: String,
                required: true
            }
        }
    }
</script>
