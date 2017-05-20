<?php

namespace App\Http\Controllers;

use App\Page;
use Illuminate\Http\Request;

class PreviewController extends Controller
{
    /**
     * Displays a preview of the current state of the editor
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = !empty($request->all()) ? $request->all() : [
            'html' => '',
            'css' => '',
            'js' => '',
            'scripts' => '[]',
            'styles' => '[]'
        ];

        $data['scripts'] = json_decode($data['scripts']);
        $data['styles'] = json_decode($data['styles']);

        return view('pages.preview', $data);
    }

    /**
     * Display the preview of a page based on the page id
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, Request $request)
    {
        $page = new Page;
        $page = $page->getPage($id);
        $latestPage = $page->getLatestPage($page);

        return view('pages.preview', [
            'html' => $latestPage['version']->html,
            'css' => $latestPage['version']->css,
            'js' => $latestPage['version']->js,
            'scripts' => json_decode($latestPage['page']->scripts),
            'styles' => json_decode($latestPage['page']->styles)
        ]);
    }
}
