<?php

namespace App\Http\Controllers;

use App\User;
use App\Page;
use App\PageHistory;
use App\Http\Helpers\PageHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class PageController extends Controller
{
    /**
     * API endpoint to return paginated list of pages based on the username
     *
     * @param  string  $username
     * @return App\Page
     */
    public function pages($username)
    {
        $creator = User::where('username', '=', $username)->firstOrFail();
        return $creator->pages()->orderBy('created_at', 'desc')->paginate(8);
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
        $sessionId = !empty($user) ? md5(Session::getId()) : $request->header('API-TOKEN');

        $page->id = PageHelper::generateId();
        $page->title = !empty($request->title) ? $request->title : $page->id;
        $page->description = !empty($request->description) ? $request->description : '';
        $page->settings = json_encode($request->settings);
        $page->scripts = json_encode($request->scripts);
        $page->styles = json_encode($request->styles);
        $page->creator_user_id = !empty($user) ? $user->id : 0;
        $page->sid = $sessionId;

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
        $sessionId = !empty($user) ? md5(Session::getId()) : $request->header('API-TOKEN');

        if ((!empty($user) && $page->creator_user_id != $user->id)|| (empty($user) && $page->sid != $sessionId)) {
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
}
