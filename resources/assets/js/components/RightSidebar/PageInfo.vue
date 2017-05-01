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
        data() {
            return {
                title: '',
                description: ''
            };
        },
        mounted() {
            const data = window.Page ? Page.data : {};
            const page = data.page || {};

            this.title = page.title || '';
            this.description = page.description || '';
        },
        methods: {
            update($e, prop) {
                this[prop] = $e.target.value;

                Event.$emit('page_updated', {
                    setting: prop,
                    value: this[prop]
                });
            }
        }
    }
</script>
