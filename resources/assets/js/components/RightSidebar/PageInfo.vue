<template>
    <div id="page-info" role="tabpanel" class="tab-pane ticket active am-scroller nano">
        <div class="nano-content">
            <div class="content">
                <h2>Page Info</h2>
                <form>
                    <div class="form-group send-ticket">
                        <label>Title</label>
                        <input type="text" placeholder="Title" class="form-control" :value="title" @input="update($event, 'title')">
                    </div>
                    <div class="form-group send-ticket">
                        <label>Description</label>
                        <textarea rows="5" placeholder="Description..." class="form-control" :value="description" @input="update($event, 'description')"></textarea>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        computed: {
            title() {
                return this.$store.state.page.title;
            },
            description() {
                return this.$store.state.page.description;
            }
        },
        methods: {
            update($e, setting) {
                this.$store.commit('update', {
                    setting: setting,
                    value: $e.target.value
                });
            }
        }
    }
</script>
