<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!--TODO: CHANGE FAVICON-->
    <link rel="shortcut icon" href="/assets/img/pi-icon.png">

    <title>Page Studio</title>

    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

    <!-- TODO: MOVE THE TWO THREE STYLE SHEETS TO ONE LOCATION-->
    <link rel="stylesheet" type="text/css" href="/assets/lib/stroke-7/style.css"/>
    <link rel="stylesheet" type="text/css" href="/assets/lib/jquery.nanoscroller/css/nanoscroller.css"/>
    <link rel="stylesheet" href="/assets/css/app.css" type="text/css"/>

</head>

<!-- TODO: FINISH STYLING THE LOGIN, REGISTER, RESET PASSWORD, AND FORGOTTEN PASSWORD PAGES -->
<body class="am-splash-screen">
	<div class="am-wrapper am-login">
		<div class="am-content">
			<div class="main-content">
				<div class="login-container">
					<div class="panel panel-default">
						<div class="panel-heading"><img src="assets/img/logo-full-retina.png" alt="logo" width="150px" height="39px" class="logo-img"><span>Please enter your user information.</span></div>
						
                        <div class="panel-body">
							<form action="index.html" method="get" class="form-horizontal">
								<div class="login-form">
									<div class="form-group">
										<div class="input-group"><span class="input-group-addon"><i class="icon s7-user"></i></span>
											<input id="username" type="text" placeholder="Username" autocomplete="off" class="form-control">
										</div>
									</div>
									<div class="form-group">
										<div class="input-group"><span class="input-group-addon"><i class="icon s7-lock"></i></span>
											<input id="password" type="password" placeholder="Password" class="form-control">
										</div>
									</div>
									<div class="form-group login-submit">
										<button data-dismiss="modal" type="submit" class="btn btn-primary btn-lg">Log me in</button>
									</div>
									<div class="form-group footer row">
										<div class="col-xs-6"><a href="#">Forgot Password?</a></div>
										<div class="col-xs-6 remember">
											<label for="remember">Remember Me</label>
											<div class="am-checkbox">
												<input type="checkbox" id="remember">
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
    
    <script>
        window.Laravel = <?php echo json_encode([
            'csrfToken' => csrf_token(),
        ]); ?>
    </script>
    <script src="/js/app.js" type="text/javascript"></script>
    <script src="/assets/lib/amaretti/amaretti.js" type="text/javascript"></script>
</body>
</html>
