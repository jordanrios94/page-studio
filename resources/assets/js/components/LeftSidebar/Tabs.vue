<template>
    <ul class="sidebar-elements">
        <slot></slot>
    </ul>
</template>
<script>
    export default {
        data() {
            return {
                tabs: []
            };
        },
        created() {
            this.tabs = this.$children;
        },
        methods: {
            updateTabs(selectedTab) {
                this.tabs.forEach(tab => {
                    tab.isActive = (tab.type == selectedTab.type)
                });
            }
        }
    }
</script>
