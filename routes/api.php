<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/page/create/anon', 'PageController@store');
Route::post('/page/update/anon', 'PageController@update');
Route::get('/pages/anon/{username}', 'PageController@pages');

Route::group(['middleware' => ['auth:api']], function () {
    Route::get('/user', 'UserController@get');
    Route::post('/page/like', 'PageController@like');
    Route::post('/page/create', 'PageController@store');
    Route::post('/page/update', 'PageController@update');
    Route::get('/pages/{username}', 'PageController@pages');
    Route::post('/profile/update', 'ProfileController@updateProfile');
    Route::post('/profile/updateEmail', 'ProfileController@updateEmail');
    Route::post('/profile/updatePassword', 'ProfileController@updatePassword');
});
