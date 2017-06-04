const { mix } = require('laravel-mix');

mix.js('resources/assets/js/pages/editor-basic.js', 'public/js/app.js');
mix.js('resources/assets/js/pages/editor-bootstrap.js', 'public/js/editor-bootstrap.js');
mix.js('resources/assets/js/pages/profile.js', 'public/js/profile.js');
