var elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    mix.less('includes/themes/theme-google.less', 'public/assets/css/app.css');
    mix.less('layout.less', 'public/assets/css/layout.css');
    mix.copy('resources/assets/lib', 'public/assets/lib');
    mix.copy('resources/assets/img', 'public/assets/img');
});
