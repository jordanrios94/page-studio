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

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/pages/{username}', 'PageController@pages');

Route::post('/page/create/anon', 'PageController@store');
Route::post('/page/update/anon', 'PageController@update');

Route::group(['middleware' => ['auth:api']], function () {
    Route::post('/page/create', 'PageController@store');
    Route::post('/page/update', 'PageController@update');
});
