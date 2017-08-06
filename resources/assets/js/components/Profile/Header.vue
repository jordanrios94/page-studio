<template>
    <div class="user-profile">
        <div class="user-display">
            <div class="photo">
                <img :src="cover_url"/>
                <div class="over" v-if="edit">
                    <div class="func">
                        <a href="#" @click="showModal" data-image="cover_url" data-width="1500" data-height="300"><i class="icon s7-camera"></i></a>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="user-avatar">
                    <img :src="profile_url" />
                    <div class="over" v-if="edit">
                        <div class="func">
                            <a href="#" @click="showModal" data-image="profile_url" data-width="300" data-height="300"><i class="icon s7-camera"></i></a>
                        </div>
                    </div>
                </div>
                <div class="user-info">
                    <h4>{{ name }} <small>{{ displayUsername }}</small></h4>
                    <span>{{ bio }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            'edit': {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                username: '',
                name: '',
                bio: '',
                profile_url: '',
                cover_url: ''
            };
        },
        created() {
            let vm = this;
            const profile = window.Profile ? Profile.data : {};

            this.username = profile.username || '';
            this.name = profile.name || '';
            this.bio = profile.bio || '';
            this.profile_url = profile.profile_url || '/assets/img/avatar-placeholder.jpg';
            this.cover_url = profile.cover_url || '/assets/img/reset.jpg';
            
            EventBus.$on('setting_updated', function($event) {
                vm[$event.setting] = $event.value;
            });
        },
        methods: {
            showModal(e) {
                e.preventDefault();
                const data = e.currentTarget.dataset;
                
                EventBus.$emit('show_modal', {
                    img: this[data.image],
                    name: data.image,
                    width: data.width,
                    height: data.height
                });
            }
        },
        computed: {
            displayUsername() {
                return '@' + this.username;
            }
        }
    }
</script>
