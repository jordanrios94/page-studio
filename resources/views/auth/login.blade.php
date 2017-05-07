@extends('layouts.splash')

@section('page')
<div class="am-wrapper am-login">
    <div class="am-content">
        <div class="main-content">
            <div class="login-container">
                <div class="panel panel-default">

                    @include('partials.splash-heading', [
                        'info' => 'Please enter your user information.'
                    ])

                    <div class="panel-body">
                        <form action="{{ route('login') }}" method="POST" class="form-horizontal">
                            <div class="login-form">
                                {{ csrf_field() }}
                                <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                                    <div class="input-group">
                                        <span class="input-group-addon">
                                            <i class="icon s7-user"></i>
                                        </span>
                                        <input id="username" type="email" placeholder="Email" autocomplete="off" value="{{ old('email') }}" class="form-control" name="email" required autofocus>
                                        @if ($errors->has('email'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('email') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                                    <div class="input-group">
                                        <span class="input-group-addon">
                                            <i class="icon s7-lock"></i>
                                        </span>
                                        <input id="password" type="password" placeholder="Password" class="form-control" name="password" required>
                                        @if ($errors->has('password'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('password') }}</strong>
                                            </span>
                                        @endif
                                    </div>
                                </div>
                                <div class="form-group login-submit">
                                    <button data-dismiss="modal" type="submit" class="btn btn-primary btn-lg">Log me in</button>
                                </div>
                                <div class="form-group footer row">
                                    <div class="col-xs-6"><a href="{{ route('password.request') }}">Forgot Password?</a></div>
                                    <div class="col-xs-6 remember">
                                        <label for="remember">Remember Me</label>
                                        <div class="am-checkbox">
                                            <input type="checkbox" id="remember" name="remember" {{ old('remember') ? 'checked' : '' }}>
                                            <label for="remember"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
