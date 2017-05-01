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

    @include('partials.right-sidebar')
</div>
@endsection