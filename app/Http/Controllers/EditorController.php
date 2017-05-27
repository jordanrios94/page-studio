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
     * Show the form for creating a new resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        return view('pages.editor', [
            'context' => [
                'page' => 'editor',
                'state' => 'create',
                'data' => [],
                'user' => $request->user(),
                'session_id' => md5(Session::getId())
            ]
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

        return view('pages.editor', [
            'context' => [
                'page' => 'editor',
                'state' => 'update',
                'data' => $latestPage,
                'user' => $request->user(),
                'session_id' => md5(Session::getId())
            ]
        ]);
    }
}
