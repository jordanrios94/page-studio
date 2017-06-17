@extends('layouts.base', [
    'data' => $context['data']
])

@section('page')
<div id="app" class="am-wrapper bootstrap-editor">
    
    @include('partials.editor-navbar', $context)

    @component('partials.left-sidebar')
        <left-sidebar-tab type="layout" icon="icon s7-browser" :selected="true">Layout</left-sidebar-tab>
        <left-sidebar-tab type="css" icon="icon s7-paint-bucket">CSS</left-sidebar-tab>
        <left-sidebar-tab type="js" icon="icon s7-file">JavaScript</left-sidebar-tab>
        <left-sidebar-tab type="preview" icon="icon s7-display1">Preview</left-sidebar-tab>
    @endcomponent

    <div class="am-content">
        <div class="editor-panels">
            <layout-panel type="layout" :selected="true"></layout-panel>
            <text-editor type="css" mode="ace/mode/css"></text-editor>
            <text-editor type="js" mode="ace/mode/javascript"></text-editor>
            <preview-panel type="preview" page-type="bootstrap" :selected="false"></preview-panel>
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
<script src="/assets/js/editor-bootstrap.js" type="text/javascript"></script>
@endpush