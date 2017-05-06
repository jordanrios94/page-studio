<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>preview</title>

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
        <script>
            {!! $js !!}
        </script>
  
    </body>
</html>