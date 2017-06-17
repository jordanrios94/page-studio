@extends('layouts.base')

@section('page')
<div id="app" class="am-wrapper am-nosidebar-left">

    @include('partials.editor-navbar', $context)

    <div class="am-content">
        <div class="main-content">
            <profile-header :edit="false"></profile-header>
            <pages></pages>
        </div>
    </div>
</div>
@endsection

@push('script-body')
<script>
    @if (Auth::check())
    window.User = <?php echo json_encode([
        'data' => Auth::user(),
    ]); ?>;
    @endif

    window.Profile = <?php echo json_encode([
        'data' => $profile
    ]); ?>;

    window.Pages = <?php echo json_encode([
      'data' => $pages
    ]); ?>;

    window.Laravel = <?php echo json_encode([
        'csrfToken' => csrf_token(),
        'apiToken' => md5(Session::getId())
    ]); ?>;
</script>
<script src="/assets/js/profile.js" type="text/javascript"></script>
@endpush