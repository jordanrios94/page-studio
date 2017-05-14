<?php

namespace App\Http\Controllers;

use App\User;
use App\Page;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Redirect the logged in user to their profile
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return redirect()->action(
            'ProfileController@show', ['username' => $request->user()->username]
        );
    }

    /**
     * Show the profile based on the username
     *
     * @param  string  $username
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show($username, Request $request)
    {
        $creator = User::where('username', '=', $username)->firstOrFail();
        $pages = $creator->pages()->orderBy('created_at', 'desc')->paginate(8);

        return view('pages.profile', [
            'context' => [
                'title' => $username,
                'page' => 'profile',
                'state' => 'none',
                'user' => $request->user()
            ],
            'profile' => $creator,
            'pages' => $pages
        ]);
    }
}
