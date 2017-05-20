<?php

namespace App\Http\Controllers;

use App\User;
use App\Page;
use App\PageLike;
use App\Http\Traits\PageRequests;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class ProfileController extends Controller
{
    use PageRequests;

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
        $user = $request->user();
        $creator = User::where('username', '=', $username)->firstOrFail();
        $pages = $this->getPaginatedPages($creator, $user, new PageLike);

        return view('pages.profile', [
            'context' => [
                'title' => $username,
                'page' => 'profile',
                'state' => 'none',
                'user' => $user
            ],
            'profile' => $creator,
            'pages' => $pages
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request)
    {
        return view('pages.settings', [
            'context' => [
                'title' => 'Settings',
                'page' => 'settings',
                'state' => 'none',
                'user' => $request->user()
            ],
            'profile' => $request->user()
        ]);
    }

    /**
     * Get a validator for an incoming profile update request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function profileValidator(array $data, $username)
    {
        return Validator::make($data, [
            'username' => [
                'required',
                'max:255',
                'alpha_dash',
                Rule::unique('users')->ignore($username, 'username'),
            ],
            'name' => ['max:50'],
            'bio' => ['max:150']
        ]);
    }

    /**
     * Get a validator for an incoming email update request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function emailValidator(array $data, $email)
    {
        return Validator::make($data, [
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($email, 'email'),
            ]
        ]);
    }

    /**
     * Get a validator for an incoming password update request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function passwordValidator(array $data)
    {
        return Validator::make($data, [
            'password' => [
                'required',
                'min:6',
                'confirmed'
            ]
        ]);
    }

    /**
     * Endpoint for the API to update the user's profile information.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return App\User
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->all();

        $this->profileValidator(
            $data,
            $user->username
        )->validate();

        $user->username = $data['username'];
        $user->name = $data['name'];
        $user->bio = $data['bio'];
        $user->save();

        return $user;
    }

    /**
     * Endpoint for the API to update the user's email address.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return App\User
     */
    public function updateEmail(Request $request)
    {
        $user = $request->user();
        $data = $request->all();

        $this->emailValidator(
            $data,
            $user->email
        )->validate();

        $user->email = $data['email'];
        $user->save();

        return $user;
    }

    /**
     * Endpoint for the API to update the user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return App\User
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();
        $data = $request->all();

        $this->passwordValidator(
            $data
        )->validate();

        $user->password = Hash::make($data['password']);
        $user->save();

        return $user;
    }
}
