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
            'js' => '',
            'scripts' => '[]',
            'styles' => '[]'
        ];

        $data['scripts'] = json_decode($data['scripts']);
        $data['styles'] = json_decode($data['styles']);

        return view('pages.preview', $data);
    }
}
