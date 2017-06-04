<template>
    <div class="pages-container" v-if="hasPages">
        <div class="gallery-container">
                <page
                    v-for="(page, index) in pages"
                    v-bind:key="page.id"
                    v-bind:page="page">
                </page>
        </div>
        <div class="load-more-container text-center">
            <button class="btn btn-primary" @click="getPages" v-show="showMoreBtn">Load more</button>
            <button class="btn btn-primary" disabled="disabled" v-show="showLoadingBtn">Loading...</button>
        </div>
    </div>
     <h3 class="text-center" v-else>No pages has been created!</h3>
</template>
<script>
    export default {
        components: {
            page: require('./Page.vue')
        },
        data() {
            return {
                username: '',
                page: 1,
                pages: [],
                showMoreBtn: false,
                showLoadingBtn: false
            };
        },
        computed: {
            hasPages() {
                return !_.isEmpty(this.pages);
            }
        },
        created() {
            const pagesData = window.Pages ? Pages.data : {};
            const profile = window.Profile ? Profile.data : {};

            this.pages = pagesData.data || [];
            this.showMoreBtn = pagesData.current_page < pagesData.last_page;
            this.username = profile.username;

            Event.$on('delete_page', this.deletePage);
        },
        methods: {
            getPages() {
                let vm = this;
                const endpoint  = window.User  ? '/api/pages/' :  '/api/pages/anon/';
                
                vm.showMoreBtn = false;
                vm.showLoadingBtn = true;

                return axios.get(endpoint + this.username, {
                    params: {
                        page: ++this.page
                    }
                })
                .then(function (response) {
                    const pagesData = response.data;
                    vm.pages = vm.pages.concat(pagesData.data);
                    vm.showLoadingBtn = false;
                    vm.showMoreBtn = pagesData.current_page < pagesData.last_page;
                })
                .catch(function (error) {
                    Notification.addMessage('', 'Something went wrong. Pages could not be loaded.', 'danger');
                });
            },
            deletePage(index) {
                this.pages.splice(index, 1);
            }
        }
    }
</script>
