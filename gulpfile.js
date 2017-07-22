process.env.DISABLE_NOTIFIER = true;

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
    mix.less('layout.less', 'public/assets/css/layout.css');
    mix.less('includes/themes/theme-google.less', 'public/assets/css/app.css');
    mix.styles([
        './node_modules/nanoscroller/bin/css/nanoscroller.css',
        './node_modules/bootstrap-slider/dist/css/bootstrap-slider.css',
        './resources/assets/lib/jquery.gritter/css/jquery.gritter.css',
        './resources/assets/lib/stroke-7/style.css',
        './public/assets/css/app.css'
    ], 'public/assets/css/site.css');
    mix.copy('resources/assets/lib', 'public/assets/lib');
    mix.copy('resources/assets/img', 'public/assets/img');
});
