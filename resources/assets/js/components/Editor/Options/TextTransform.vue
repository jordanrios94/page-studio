<template>
<div class="form-group">
    <label>{{ label }}</label>
    <div class="btn-group btn-group-vertical">
        <a href="#" :class="$parent.hasClasses('btn btn-primary', ['text-lowercase','text-uppercase','text-capitalize'])" @click="$parent.changeClass($event, '', 'textTransform')">
            None
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'lowercase')" @click="$parent.changeClass($event, 'lowercase', 'textTransform')">
            Lowercase
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'uppercase')" @click="$parent.changeClass($event, 'uppercase', 'textTransform')">
            Uppercase
        </a>
        <a href="#" :class="$parent.hasClass('btn btn-primary', 'capitalize')" @click="$parent.changeClass($event, 'capitalize', 'textTransform')">
            Capitalize
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
