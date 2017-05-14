@extends('layouts.base', [
    'data' => $context['data']
])

@section('page')
<div id="app" class="am-wrapper">
    @include('partials.editor-navbar', $context)

    @include('partials.left-sidebar')

    <div class="am-content">
        <div class="main-content editor-panels">
            <div class="editor-panel">
                <text-editor type="html" mode="ace/mode/html" :selected="true" init-value="{!! !empty($context['data']) ? $context['data']['version']->html : '' !!}"></text-editor>
                <text-editor type="css" mode="ace/mode/css" init-value="{!! !empty($context['data']) ? $context['data']['version']->css : '' !!}"></text-editor>
                <text-editor type="js" mode="ace/mode/javascript" init-value="{!! !empty($context['data']) ? $context['data']['version']->js : '' !!}"></text-editor>
            </div>
            <preview-panel></preview-panel>
        </div>
    </div>

    @include('partials.right-sidebar', $context)
</div>
@endsection

@push('script-body')
<script>
    @if (Auth::check())
    window.User = <?php echo json_encode([
        'data' => Auth::user(),
    ]); ?>;
    @endif
    
    @if (!empty($context['data']))
    window.Page = <?php echo json_encode([
        'data' => $context['data'],
    ]); ?>;
    @endif

    window.Laravel = <?php echo json_encode([
        'csrfToken' => csrf_token(),
        'apiToken' => md5(Session::getId())
    ]); ?>;
    
    TogetherJSConfig_toolName = 'Collaboration';
</script>
<script src="https://togetherjs.com/togetherjs-min.js"></script>
<script src="/assets/lib/ace/ace.js" type="text/javascript"></script>
<script src="/js/app.js" type="text/javascript"></script>
@endpush