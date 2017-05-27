@extends('layouts.base')

@section('page')
<div id="app" class="am-wrapper am-nosidebar-left">

    @include('partials.editor-navbar', $context)

    <div class="am-content">
        <div class="main-content">

            <profile-header></profile-header>
            
            <div class="tab-container">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#profile" data-toggle="tab">Profile</a></li>
                    <li><a href="#account" data-toggle="tab">Account</a></li>
                </ul>
                <div class="tab-content">
                    <profile-tab></profile-tab>
                    <account-tab></account-tab>
                </div>
            </div>
            
        </div>
    </div>
    <modal></modal>
</div>
@endsection

@push('script-body')
<script>
    window.Profile = <?php echo json_encode([
        'data' => Auth::user()
    ]); ?>;

    window.Laravel = <?php echo json_encode([
        'csrfToken' => csrf_token(),
        'apiToken' => md5(Session::getId())
    ]); ?>;
</script>
<script src="/js/profile.js" type="text/javascript"></script>
@endpush