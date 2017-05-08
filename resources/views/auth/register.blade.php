@extends('layouts.splash')

@section('page')
<div class="am-wrapper am-login am-signup">
	<div class="am-content">
		<div class="main-content">
			<div class="login-container sign-up">
				<div class="panel panel-default">
                    @include('partials.splash-heading', [
                        'info' => 'Please enter your user information.'
                    ])
                    <div class="panel-body">
						<form action="{{ route('register') }}" parsley-validate="" novalidate="" method="POST" class="form-horizontal">
                            {{ csrf_field() }}
							<div class="sign-up-form">
								<div class="form-group{{ $errors->has('username') ? ' has-error' : '' }}">
									<div id="nick-handler" class="input-group">
                                        <span class="input-group-addon">
                                            <i class="icon s7-user"></i>
                                        </span>
										<input
                                            id="name"
                                            type="text"
                                            name="username"
                                            value="{{ old('username') }}"
                                            placeholder="Username"
                                            class="form-control"
                                            required
                                            autofocus>
                                        @if ($errors->has('username'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('username') }}</strong>
                                            </span>
                                        @endif
									</div>
								</div>
								<div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
									<div id="email-handler" class="input-group">
                                        <span class="input-group-addon">
                                            <i class="icon s7-mail"></i>
                                        </span>
										<input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value="{{ old('email') }}"
                                            placeholder="E-mail"
                                            class="form-control"
                                            required>
                                        @if ($errors->has('email'))
                                            <span class="help-block">
                                                <strong>{{ $errors->first('email') }}</strong>
                                            </span>
                                        @endif
									</div>
								</div>
								<div class="form-group{{ $errors->has('password') ? ' has-error' : '' }} row">
									<div class="col-xs-6">
										<div id="password-handler" class="input-group">
                                            <span class="input-group-addon"><i class="icon s7-lock"></i></span>
											<input
                                                id="password"
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                class="form-control"
                                                required>
										</div>
									</div>
									<div class="col-xs-6">
										<div id="confirm-handler" class="input-group">
                                            <span class="input-group-addon"><i class="icon s7-lock"></i></span>
											<input
                                                id="password-confirm"
                                                type="password"
                                                name="password_confirmation"
                                                placeholder="Confirm"
                                                class="form-control"
                                                required>
										</div>
									</div>

                                    @if ($errors->has('password'))
                                    <div class="col-xs-12">
                                        <span class="help-block">
                                            <strong>{{ $errors->first('password') }}</strong>
                                        </span>
                                    </div>
                                    @endif
								</div>
							</div>
							<p class="conditions">By creating an account, you agree with the <a href="/termsandconditions">Terms and Conditions</a>.</p>
							<button type="submit" class="btn btn-block btn-primary btn-lg">Sign Up</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
@endsection
