const { mix } = require('laravel-mix');

mix.js('resources/assets/js/pages/editor-basic.js', 'public/assets/js/app.js');
mix.js('resources/assets/js/pages/editor-bootstrap.js', 'public/assets/js/editor-bootstrap.js');
mix.js('resources/assets/js/pages/profile.js', 'public/assets/js/profile.js');
