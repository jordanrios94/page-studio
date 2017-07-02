<?php

namespace App\Http\Controllers;

use App\User;
use App\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class EditorController extends Controller
{
    /**
     * Show the page for creating a new basic page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createBasic(Request $request)
    {
        return view('pages.editor_basic', [
            'context' => [
                'page' => 'editor',
                'state' => 'create',
                'data' => [],
                'user' => $request->user(),
                'session_id' => md5(Session::getId()),
                'type' => 'basic'
            ]
        ]);
    }

    /**
     * Show the page for creating a new bootstrap page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function createBootstrap(Request $request)
    {
        return view('pages.editor_bootstrap', [
            'context' => [
                'page' => 'editor',
                'state' => 'create',
                'data' => [],
                'user' => $request->user(),
                'session_id' => md5(Session::getId()),
                'type' => 'bootstrap'
            ]
        ]);
    }

    /**
     * The iframe's content when editing using the bootstrap editor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function layoutBootstrap($id, Request $request)
    {
        header('X-XSS-Protection: 0');

        $html = '';
        $css = '';

        if (!empty($id) && $id !== 'new') {
            $page = new Page;
            $latestPage = $page->getLatestPage($id);
            $html = $latestPage['version']->html;
            $css = $latestPage['version']->css;
        }

        return view('pages.layout', [
            'html' => $html,
            'css' => $css
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id, Request $request)
    {
        if (empty($id)) abort(404);

        $page = new Page;
        $latestPage = $page->getLatestPage($id);

        $latestPage['creator'] = $latestPage['page']->creator_user_id != 0 ? User::find($latestPage['page']->creator_user_id): [];
        $latestPage['version']->html = base64_encode($latestPage['version']->html);
        $latestPage['version']->css = base64_encode($latestPage['version']->css);
        $latestPage['version']->js = base64_encode($latestPage['version']->js);

        $view = $latestPage['page']->type === 'bootstrap' ? 'pages.editor_bootstrap' : 'pages.editor_basic';

        return view($view, [
            'context' => [
                'page' => 'editor',
                'state' => 'update',
                'data' => $latestPage,
                'user' => $request->user(),
                'session_id' => md5(Session::getId()),
                'type' => $latestPage['page']->type
            ]
        ]);
    }
}
