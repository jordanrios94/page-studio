<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-justified">
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'text-left', '')" @click="$parent.changeClass($event, 'left', 'alignment', 'text')">
            <span class="glyphicon glyphicon-align-left" aria-hidden="true"></span>
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'text-center', '')" @click="$parent.changeClass($event, 'center', 'alignment', 'text')">
            <span class="glyphicon glyphicon-align-center" aria-hidden="true"></span>
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'text-right', '')" @click="$parent.changeClass($event, 'right', 'alignment', 'text')">
            <span class="glyphicon glyphicon-align-right" aria-hidden="true"></span>
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'text-justify', '')" @click="$parent.changeClass($event, 'justify', 'alignment', 'text')">
            <span class="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'text-nowrap', '')" @click="$parent.changeClass($event, 'nowrap', 'alignment', 'text')">
            <span class="glyphicon glyphicon-minus" aria-hidden="true"></span>
        </a>
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
