@extends('layouts.base')

@section('page')
<div id="app" class="am-wrapper am-nosidebar-left">

    @include('partials.editor-navbar', $context)

    <div class="am-content">
        <div class="main-content">
            <div class="user-profile">
                <div class="user-display">
                    <div class="photo">
                        <img src="{{ $profile->cover_url }}"/>
                    </div>
                    <div class="bottom">
                        <div class="user-avatar">
                            <img src="{{ $profile->profile_url }}">
                        </div>
                        <div class="user-info">
                            <h4>{{ $profile->name or $profile->username }} <small>{{ '@' . $profile->username }}</small></h4>
                            <span>{{ $profile->bio }}</span>
                        </div>
                    </div>
                </div>
            </div>
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
<script src="/js/profile.js" type="text/javascript"></script>
@endpush