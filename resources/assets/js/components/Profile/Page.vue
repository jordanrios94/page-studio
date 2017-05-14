<template>
    <div class="item">
        <div class="photo">
            <div class="img">
                <iframe name="preview" :src="previewUrl" height="100%" style="position: absolute;" frameborder="0"></iframe>
                <div class="over">
                <div class="func">
                    <a href="#"><i class="icon s7-link"></i></a>
                    <a :href="pageUrl" class="image-zoom"><i class="icon s7-monitor"></i></a></div>
                </div>
            </div>
            <div class="description">
                <div class="icon"><a href="#"><i class="s7-like"></i></a></div>
                <div class="desc">
                    <h4>{{ page.title }}</h4><span>{{ createdFrom }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['page'],
        data() {
            return {
            };
        },
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
        }
    }
</script>
