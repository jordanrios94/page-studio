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

    <!-- TODO: COMPILE THE THREE STYLE SHEETS TO ONE LOCATION-->
    <link rel="stylesheet" type="text/css" href="/assets/lib/stroke-7/style.css"/>
    <link rel="stylesheet" type="text/css" href="/assets/lib/jquery.nanoscroller/css/nanoscroller.css"/>
    <link rel="stylesheet" type="text/css" href="/assets/lib/jquery.gritter/css/jquery.gritter.css"/>

    <link rel="stylesheet" href="/assets/css/app.css" type="text/css"/>

</head>
<body>

@yield('page')

<script>
    @if (!empty($data))
    window.Page = <?php echo json_encode([
        'data' => $data,
    ]); ?>;
    @endif
    window.Laravel = <?php echo json_encode([
        'csrfToken' => csrf_token(),
    ]); ?>;
    TogetherJSConfig_toolName = 'Collaboration';
</script>
<script src="https://togetherjs.com/togetherjs-min.js"></script>
<script src="/assets/lib/ace/ace.js" type="text/javascript"></script>
<script src="/js/app.js" type="text/javascript"></script>
<script src="/assets/lib/amaretti/amaretti.js" type="text/javascript"></script>

</body>
</html>