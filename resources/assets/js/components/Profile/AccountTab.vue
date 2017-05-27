<template>
    <div id="account" class="tab-pane cont">
        <div class="row user-settings">
            <div class="col-sm-12">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <form action="#">
                            <div class="form-group">
                                <label>Email address</label>
                                <input type="email" name="email" :value="email" v-model="email" required placeholder="Enter email" class="form-control">
                            </div>
                            <div class="text-right">
                                <button type="submit" class="btn btn-space btn-primary" @click="updateEmail">Update email</button>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input id="password" type="password" v-model="password" placeholder="Password" required class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Repeat Password</label>
                                <input type="password" v-model="password_confirmation" required placeholder="Password" class="form-control">
                            </div>
                            <div class="text-right">
                                <button type="submit" class="btn btn-space btn-primary" @click="updatePassword">Update password</button>
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
                email: '',
                password: '',
                password_confirmation: ''
            };
        },
        created() {
            const profile = window.Profile ? Profile.data : {};

            this.email = profile.email || '';
        },
        methods: {
            updateEmail(e) {
                e.preventDefault();

                return this.$parent.$options.methods.callApi(
                    '/api/profile/updateEmail',
                    { email: this.email },
                    'Email has been successfully updated.',
                    'There was a problem updating your email.'
                );
            },
            updatePassword(e) {
                e.preventDefault();
                let vm = this;
                
                return this.$parent.$options.methods.callApi(
                    '/api/profile/updatePassword',
                    { 
                        password: vm.password,
                        password_confirmation: vm.password_confirmation
                    },
                    'Password has been successfully updated.',
                    'There was a problem updating your password.',
                    function () {
                        vm.password = vm.password_confirmation = '';
                    }
                );
            }
        },
        computed: {
            passwordValid() {
                return _.isEmpty(this.password) ? false : this.password === this.repeated_password;
            }
        }
    }
</script>
