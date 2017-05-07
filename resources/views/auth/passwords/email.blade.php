@extends('layouts.splash')

@section('page')
<div class="am-wrapper am-login">
	<div class="am-content">
		<div class="main-content">
			<div class="login-container forgot-password">
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
						<form action="{{ route('password.email') }}" parsley-validate="" novalidate="" method="POST" class="form-horizontal">
                            {{ csrf_field() }}
							<p class="text-center">Don't worry, we'll send you an email to reset your password.</p>
							<div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
								<div id="email-handler" class="input-group"><span class="input-group-addon"><i class="icon s7-mail"></i></span>
									<input
                                        type="email"
                                        name="email"
                                        value="{{ old('email') }}"
                                        placeholder="Your Email"
                                        autocomplete="off"
                                        class="form-control"
                                        required>
                                    
                                    @if ($errors->has('email'))
                                        <span class="help-block">
                                            <strong>{{ $errors->first('email') }}</strong>
                                        </span>
                                    @endif
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
