@extends('layouts.base')

@section('page')
<div id="app" class="am-wrapper am-nosidebar-left">

    @include('partials.editor-navbar', $context)

    <div class="am-content">
        <div class="main-content">

            <div class="user-profile">
                <div class="user-display">
                    <div class="photo">
                        <img src="/assets/img/profile.jpg">
                    </div>
                    <div class="bottom">
                        <div class="user-avatar">
                            <img src="/assets/img/avatar9.jpg">
                        </div>
                        <div class="user-info">
                            <h4>@{{ name }} <small>@{{ displayUsername }}</small></h4>
                            <span>@{{ bio }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tab-container">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#profile" data-toggle="tab">Profile</a></li>
                    <li><a href="#account" data-toggle="tab">Account</a></li>
                </ul>
                <div class="tab-content">

                    <div id="profile" class="tab-pane active cont">
                        <div class="row user-settings">
                            <div class="col-sm-12">
                                <div class="panel panel-default">
                                    <div class="panel-body">
                                        <form action="#">
                                            <div class="form-group">
                                                <label>Username</label>
                                                <input type="text" name="username" :value="username" v-model="username" required placeholder="Enter user name" class="form-control">
                                            </div>
                                            <div class="form-group">
                                                <label>Profile name</label>
                                                <input type="text" name="name" :value="name" v-model="name" required placeholder="Enter name" class="form-control">
                                            </div>
                                            <div class="form-group">
                                                <label>Bio</label>
                                                <textarea class="form-control no-resize" v-model="bio" rows="3">@{{ bio }}</textarea>
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

                </div>
            </div>
        </div>
    </div>

</div>
@endsection

@push('script-body')
<script>
    window.Profile = <?php echo json_encode([
        'data' => Auth::user()
    ]); ?>;

    window.Laravel = <?php echo json_encode([
        'csrfToken' => csrf_token(),
        'apiToken' => md5(Session::getId())
    ]); ?>;
</script>
<script src="/js/profile.js" type="text/javascript"></script>
@endpush