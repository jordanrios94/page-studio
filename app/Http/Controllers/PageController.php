<?php

namespace App\Http\Controllers;

use App\User;
use App\Page;
use App\PageLike;
use App\PageHistory;
use App\Http\Traits\ModelCreation;
use App\Http\Traits\PageRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class PageController extends Controller
{
    use PageRequests;
    use ModelCreation;

    /**
     * API endpoint to return paginated list of pages based on the username.
     *
     * @param  string  $username
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function pages($username, Request $request)
    {
        $creator = User::where('username', '=', $username)->firstOrFail();

        return $this->getPaginatedPages($creator, $request->user(), new PageLike);
    }

    /**
     * API endpoint for when an authenticated user likes a page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function like(Request $request)
    {
        $userID = $request->user()->id;
        $pageID = $request->page_id;

        if (empty($pageID)) abort(422);

        $pageLike = new PageLike;
        $like = $pageLike->get($userID, $pageID);

        if (empty($like)) {
            $pageLike->page_id = $pageID;
            $pageLike->user_id = $userID;
            $pageLike->save();
        } else {
            $like->delete();
        }

        return [
            'updated' => true
        ];
    }

    /**
     * API endpoint for when a user deletes a page.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        $like = new PageLike;
        $history = new PageHistory;
        $userID = $request->user()->id;
        $pageID = $request->page_id;
        $page = Page::findOrFail($pageID);

        if ($page->creator_user_id != $userID) {
            abort(401, 'This action is not allowed.');
        }

        $like->deleteLikes($pageID);
        $history->deleteHistory($pageID);
        $page->delete();

        return [
            'deleted' => true
        ];
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

        $page->id = $this->generateId();
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
            abort(500, 'Error creating the new page!');
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
            abort(401, 'Forbidden!');
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
            abort(500, 'Error creating the new page!');
        } else {
            return json_encode([
                'page_id' => $page->id,
                'status' => 'successful',
                'message' => 'Page successfully updated!'
            ]);
        }
    }
}
