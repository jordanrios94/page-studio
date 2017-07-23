@extends('layouts.splash')

@section('page')
<div class="am-wrapper am-error am-error-404">
    <div class="am-content">
    <div class="main-content">
        <div class="error-container">
        <div class="error-image"></div>
        <div class="error-number">404</div>
        <p class="error-description">The page you are looking for might have been removed.</p>
        <div class="error-goback-text">Would you like to go <a href="/">home</a>?</div>
        <div class="footer">&copy; 2017 <a href="#">PageStudio</a></div>
        </div>
    </div>
    </div>
</div>
@endsection
