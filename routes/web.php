<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

/** SPLASH PAGE ROUTE **/
Route::get('/', function () {
    return view('pages.welcome');
});

Route::get('/terms', function () {
    return view('pages.terms');
});

/** PREVIEW ROUTES **/
Route::match(['get', 'post'], '/page/preview', 'PreviewController@index');
Route::match(['get'], '/page/preview/{id}', 'PreviewController@show');

/** EDITOR ROUTES **/
Route::get('/page/layout/bootstrap', 'EditorController@layoutBootstrap');
Route::get('/page/create/basic', 'EditorController@createBasic');
Route::get('/page/create/bootstrap', 'EditorController@createBootstrap');
Route::get('/page/{id}', 'EditorController@edit');

/** PROFILE ROUTES **/
Route::group(['middleware' => 'auth'], function () {
    Route::get('/profile', 'ProfileController@index');
    Route::get('/profile/settings', 'ProfileController@edit');
});
Route::get('/profile/{username}', 'ProfileController@show');
Route::get('/profile/{type}/{filename}', 'FileController@showProfileImage');
