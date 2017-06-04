<template>
    <aside class="page-aside">
        <div class="am-scroller nano">
            <div id="dragitemslistcontainer" class="nano-content" style="margin-right: 0px;">
                <accordion id="accordion4">
                    <panel id="ac4-1" title="Grid">
                        <panel-item title="Row" html=""></panel-item>
                        <panel-item title="Row + 1 Column" html=""></panel-item>
                    </panel>
                    <panel id="ac4-2" title="Sections">
                        <panel-item title="Login Form" :html="this.$store.state.html.loginForm"></panel-item>
                    </panel>
                    <panel id="ac4-3" title="Components">
                        <panel-item title="Alert" :html="this.$store.state.html.alert"></panel-item>
                        <panel-item title="Badge" :html="this.$store.state.html.badge"></panel-item>
                        <panel-item title="Media" :html="this.$store.state.html.media"></panel-item>
                        <panel-item title="Jumbotron" :html="this.$store.state.html.jumbotron"></panel-item>
                        <panel-item title="Panel" :html="this.$store.state.html.panel"></panel-item>
                        <panel-item title="Progress Bar" :html="this.$store.state.html.progressBar"></panel-item>
                        <panel-item title="Thumbnails" :html="this.$store.state.html.thumbnails"></panel-item>
                        <panel-item title="List Group" :html="this.$store.state.html.listGroup"></panel-item>
                    </panel>
                    <panel id="ac4-4" title="Typography">
                        <panel-item title="Header" :html="this.$store.state.html.header"></panel-item>
                        <panel-item title="Paragraph" :html="this.$store.state.html.paragraph"></panel-item>
                    </panel>
                    <panel id="ac4-5" title="Navigation">
                        <panel-item title="Pager" :html="this.$store.state.html.pager"></panel-item>
                        <panel-item title="Pagination" :html="this.$store.state.html.pagination"></panel-item>
                        <panel-item title="Breadcrumb" :html="this.$store.state.html.breadcrumb"></panel-item>
                        <panel-item title="Button" :html="this.$store.state.html.button"></panel-item>
                        <panel-item title="Button Group" :html="this.$store.state.html.buttonGroup"></panel-item>
                        <panel-item title="Button Dropdown" :html="this.$store.state.html.buttonDropdown"></panel-item>
                        <panel-item title="Nav Tabs" :html="this.$store.state.html.navTabs"></panel-item>
                        <panel-item title="Linked List Group" :html="this.$store.state.html.linkedListGroup"></panel-item>
                    </panel>
                </accordion>
            </div>
            <div class="nano-pane" style="display: none;">
                <div class="nano-slider" style="height: 902px; transform: translate(0px, 0px);"></div>
            </div>
        </div>
    </aside>
</template>
<script>
    export default {
        components: {
            'accordion': require('./Accordion.vue'),
            'panel': require('./Panel.vue'),
            'panel-item': require('./PanelItem.vue')
        }
    }
</script>
