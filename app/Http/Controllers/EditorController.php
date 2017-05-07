<?php

namespace App\Http\Controllers;

use App\Page;
use App\PageHistory;
use App\Http\Helpers\PageHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EditorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
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
                'ip' => $request->ip()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $page = new Page;
        $version = new PageHistory;
        $user = $request->user();

        $page->id = PageHelper::generateId();
        $page->title = !empty($request->title) ? $request->title : $page->id;
        $page->description = !empty($request->description) ? $request->description : '';
        $page->settings = json_encode($request->settings);
        $page->scripts = json_encode($request->scripts);
        $page->styles = json_encode($request->styles);
        $page->creator_user_id = !empty($user) ? $user->id : 0;
        $page->creator_ip = $request->ip();

        $version->page_id = $page->id;
        $version->html = !empty($request->html) ? $request->html : '';
        $version->css = !empty($request->css) ? $request->css : '';
        $version->js = !empty($request->js) ? $request->js : '';
        $version->editor_user_id = $page->creator_user_id;

        $savedPage = $page->save();
        $savedVersion = $version->save();

        if (!$savedPage || !$savedVersion) {
            App::abort(500, 'Error creating the new page!');
        } else {
            return json_encode([
                'page_id' => $page->id,
                'status' => 'successful',
                'message' => 'Page successfully created!'
            ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id, Request $request)
    {
        /**
        * 1) Check ID isset
        *      a) IF not set, show 404 page
        *      b) ELSE proceed
        * 2) Check if page exists
        *      a) IF page does not exist, show 404 page
        *      b_ ELSE proceed
        * 3) Display page
        */
        if (empty($id)) abort(404);

        $page = new Page;
        $latestPage = $page->getLatestPage($id);
        $latestPage['version']->html = base64_encode($latestPage['version']->html);
        $latestPage['version']->css = base64_encode($latestPage['version']->css);
        $latestPage['version']->js = base64_encode($latestPage['version']->js);

        return view('pages.editor', [
            'context' => [
                'page' => 'editor',
                'state' => 'update',
                'data' => $latestPage,
                'user' => $request->user(),
                'ip' => $request->ip()
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $page = Page::findOrFail($request->id);
        $version = new PageHistory;
        $user = $request->user();

        if (($page->creator_user_id != $user->id)|| (empty($user) && $page->creator_ip != $request->ip())) {
            App::abort(401, 'Forbidden!');
        }

        $page->title = !empty($request->title) ? $request->title : $page->id;
        $page->description = !empty($request->description) ? $request->description : '';
        $page->settings = json_encode($request->settings);
        $page->scripts = json_encode($request->scripts);
        $page->styles = json_encode($request->styles);

        $version->page_id = $page->id;
        $version->html = !empty($request->html) ? $request->html : '';
        $version->css = !empty($request->css) ? $request->css : '';
        $version->js = !empty($request->js) ? $request->js : '';
        $version->editor_user_id = !empty($user) ? $user->id : 0;

        $savedPage = $page->save();
        $savedVersion = $version->save();

        if (!$savedPage || !$savedVersion) {
            App::abort(500, 'Error creating the new page!');
        } else {
            return json_encode([
                'page_id' => $page->id,
                'status' => 'successful',
                'message' => 'Page successfully updated!'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
    
}
