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

/** COLLECTION ROUTES **/
Route::get('/home', 'HomeController@index');
Route::get('/collection', 'CollectionController@index');

/** PREVIEW ROUTES **/
Route::match(['get', 'post'], '/editor/preview', 'PreviewController@index');

/** EDITOR ROUTES **/
Route::get('/editor/create', 'EditorController@create');
Route::get('/editor/{id}', 'EditorController@edit');