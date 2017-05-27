<template>
    <div id="profile" class="tab-pane active cont">
        <div class="row user-settings">
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <form action="#">
                            <div class="form-group">
                                <label>Username</label>
                                <input type="text" name="username" :value="username" v-model="username" required placeholder="Enter user name" class="form-control" @keyup="emitChange">
                            </div>
                            <div class="form-group">
                                <label>Profile name</label>
                                <input type="text" name="name" :value="name" v-model="name" required placeholder="Enter name" class="form-control" @keyup="emitChange">
                            </div>
                            <div class="form-group">
                                <label>Bio</label>
                                <textarea class="form-control no-resize" name="bio" v-model="bio" rows="3" @keyup="emitChange"></textarea>
                            </div>
                            <div class="text-right">
                                <button type="submit" class="btn btn-space btn-primary" @click="updateProfile">Update profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                name: '',
                username: '',
                bio: ''
            };
        },
        created() {
            const profile = window.Profile ? Profile.data : {};

            this.name = profile.name || '';
            this.username = profile.username || '';
            this.bio = profile.bio || '';
        },
        methods: {
            emitChange(e) {
                e.preventDefault();

                Event.$emit('setting_updated', {
                    setting: e.currentTarget.name,
                    value: e.currentTarget._value
                });
            },
            updateProfile(e) {
                e.preventDefault();

                return this.$parent.$options.methods.callApi(
                    '/api/profile/update',
                    this.getProfileData(),
                    'Profile has been successfully updated.',
                    'There was a problem saving your profile.'
                );
            },
            getProfileData() {
                return {
                    name: this.name,
                    username: this.username,
                    bio: this.bio
                };
            }
        }
    }
</script>
