<template>
    <a href="#" class="list-group-item" draggable="true" :data-insert-html='html'>
        <span class="badge"><span class="glyphicon glyphicon-menu-hamburger"></span></span> {{ title }}
    </a>
</template>
<script>
    export default {
        props: {
            html: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            }
        }
    }
</script>
