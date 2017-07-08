<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>preview</title>

        @if ($type === 'bootstrap')
            <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        @endif

        @foreach ($styles as $style)
            <link rel="stylesheet" type="text/css" href="{{ $style->value }}">
        @endforeach
        <style>
            {!! $css !!}
        </style>
    </head>
    <body>
        {!! $html !!}

        @foreach ($scripts as $script)
            <script src="{{ $script->value }}"></script>
        @endforeach

        @if ($type === 'bootstrap')
            <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
            <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js">
        @endif
        
        <script>
            {!! $js !!}
        </script>
    </body>
</html>
