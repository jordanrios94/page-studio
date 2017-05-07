@extends('layouts.splash')

@section('page')
<div class="am-wrapper am-login am-signup">
	<div class="am-content">
		<div class="main-content">
			<div class="login-container reset-password">
				<div class="panel panel-default">
                    @include('partials.splash-heading', [
                        'info' => 'Forgot your password?'
                    ])
                    <div class="panel-body">
                        @if (session('status'))
                            <div role="alert" class="alert alert-success alert-icon">
                                <div class="icon">
                                    <span class="s7-check"></span>
                                </div>
                                <div class="message">
                                    {{ session('status') }} 
                                </div>
                            </div>
                        @endif
						<form action="{{ route('password.request') }}" novalidate="" method="POST" class="form-horizontal">
                            {{ csrf_field() }}
                            <input type="hidden" name="token" value="{{ $token }}">
							<div class="reset-form">
								<div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
									<div id="email-handler" class="input-group">
                                        <span class="input-group-addon">
                                            <i class="icon s7-mail"></i>
                                        </span>
										<input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value="{{ $email or old('email') }}"
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
								<div class="form-group row">
									<div class="col-xs-6">
										<div id="password-handler" class="input-group{{ $errors->has('password') ? ' has-error' : '' }}">
                                            <span class="input-group-addon"><i class="icon s7-lock"></i></span>
											<input
                                                id="password"
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                class="form-control"
                                                required>
                                            @if ($errors->has('password'))
                                                <span class="help-block">
                                                    <strong>{{ $errors->first('password') }}</strong>
                                                </span>
                                            @endif
										</div>
									</div>
									<div class="col-xs-6">
										<div id="confirm-handler" class="input-group{{ $errors->has('password_confirmation') ? ' has-error' : '' }}">
                                            <span class="input-group-addon"><i class="icon s7-lock"></i></span>
											<input
                                                id="password-confirm"
                                                type="password"
                                                name="password_confirmation"
                                                placeholder="Confirm"
                                                class="form-control"
                                                required>
                                            @if ($errors->has('password_confirmation'))
                                                <span class="help-block">
                                                    <strong>{{ $errors->first('password_confirmation') }}</strong>
                                                </span>
                                            @endif
										</div>
									</div>
								</div>
							</div>
							<button type="submit" class="btn btn-block btn-primary btn-lg">Reset Password</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
@endsection
