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
    return view('welcome');
});

Route::get('/termsandconditions', function () {
    return view('pages.termsandconditions');
});

/** TODO: GET RID OF HOME ROUTE **/
Route::get('/home', 'HomeController@index');

/** PREVIEW ROUTES **/
Route::match(['get', 'post'], '/page/preview', 'PreviewController@index');
Route::match(['get'], '/page/preview/{id}', 'PreviewController@show');

/** EDITOR ROUTES **/
Route::get('/page/create', 'EditorController@create');
Route::get('/page/{id}', 'EditorController@edit');

/** PROFILE ROUTES **/
Route::group(['middleware' => 'auth'], function () {
    Route::get('/profile', 'ProfileController@index');
    Route::get('/profile/settings', 'ProfileController@edit');
});
Route::get('/profile/{username}', 'ProfileController@show');
