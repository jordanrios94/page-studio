<template>
    <div class="item">
        <div class="photo">
            <div class="img">
                <iframe name="preview" :src="previewUrl" height="100%" style="position: absolute;" frameborder="0"></iframe>
                <div class="over">
                <div class="func">
                    <a href="#" @click="copyToClipbard"><i class="icon s7-link"></i></a>
                    <a :href="pageUrl" class="image-zoom"><i class="icon s7-monitor"></i></a></div>
                </div>
            </div>
            <div class="description">
                <div class="icon">
                    <a href="#" @click="like">
                        <i class="glyphicon glyphicon-heart" v-if="page.hasLiked"></i>
                        <i class="s7-like" v-else></i>
                    </a>
                </div>
                <div class="desc">
                    <h4>{{ page.title }}</h4>
                    <span>{{ createdFrom }}</span>
                    <span class="pull-right">
                        <i class="s7-like like-icon"></i>
                        <span class="like-count">{{ page.likes_count }}</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['page'],
        computed: {
            createdFrom() {
                return moment(this.page.created_at, 'YYYY-MM-DD hh:mm:ss').fromNow();
            },
            pageUrl() {
                return '/page/' + this.page.id;
            },
            previewUrl() {
                return '/page/preview/' +  this.page.id;
            }
        },
        created() {
            this.page.likes_count = parseInt(this.page.likes_count);
        },
        methods: {
            showError(error) {
                const status = error.response.status;
                let message = '';

                switch (status) {
                    case 401:
                        message = 'You must be logged in to like this page.';
                        break;
                    case 422:
                        message = 'No page has been specified.';
                        break;
                    default:
                        message = 'This action cannot be performed at thim moment.';
                        break;
                }

                Notification.addMessage('', message, 'danger');
            },
            like(e) {
                e.preventDefault();
                let vm = this;

                return axios.post('/api/page/like', {
                        page_id: this.page.id
                    })
                    .then(function (response) {
                        if (vm.page.hasLiked) {
                            vm.page.likes_count--;
                        } else {
                            vm.page.likes_count++;
                        }

                        vm.page.hasLiked = !vm.page.hasLiked;
                    })
                    .catch(vm.showError);
            },
            copyToClipbard(e) {
                e.preventDefault();
                const text = window.location.host + this.pageUrl;
                const id = "hiddenClipboard";
                let existsTextarea = document.getElementById(id);

                if (!existsTextarea) {
                    let textarea = document.createElement("textarea");
                    textarea.id = id;
                    textarea.style.position = 'fixed';
                    textarea.style.top = 0;
                    textarea.style.left = 0;
                    textarea.style.width = '1px';
                    textarea.style.height = '1px';
                    textarea.style.padding = 0;
                    textarea.style.border = 'none';
                    textarea.style.outline = 'none';
                    textarea.style.boxShadow = 'none';
                    textarea.style.background = 'transparent';
                    document.querySelector("body").appendChild(textarea);
                    existsTextarea = document.getElementById(id);
                }

                existsTextarea.value = text;
                existsTextarea.select();

                try {
                    var status = document.execCommand('copy');
                    if (!status) {
                        Notification.addMessage('Error!', 'Cannot copy page link to clipboard.', 'danger');
                    } else {
                        Notification.addMessage('', 'Copied Page link to clipboard.', 'success');
                    }
                } catch (err) {
                    Notification.addMessage('Error!', 'Unable to copy page link to clipboard.', 'danger');
                }
            }
        }
    }
</script>
