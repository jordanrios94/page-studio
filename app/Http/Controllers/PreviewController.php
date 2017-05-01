<?php

namespace App\Http\Controllers;

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
            'js' => ''
        ];

        return view('pages.preview', $data);
    }
}
