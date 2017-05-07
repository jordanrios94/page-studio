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

Route::post('/page/create/anon', 'EditorController@store');
Route::post('/page/update/anon', 'EditorController@update');
Route::middleware('auth:api')->post('/page/create', 'EditorController@store');
Route::middleware('auth:api')->post('/page/update', 'EditorController@update');
