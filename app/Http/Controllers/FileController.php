<?php

namespace App\Http\Controllers;

use App\Http\Traits\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class FileController extends Controller
{
    use UserProfile;

    /**
     * Get a validator for an incoming avatar or cover image update request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function imageValidator(array $data)
    {
        return Validator::make($data, [
            'image' => [
                'required'
            ],
            'name' => [
                'required',
                Rule::in(['profile_url', 'cover_url']),
            ]
        ]);
    }

    /**
     * Display the file stored for the avatar or cover files.
     *
     * @return \Illuminate\Http\Response
     */
    public function showProfileImage($type, $filename, Request $request)
    {
        $validTypes = ['avatar', 'cover'];

        if (!in_array($type, $validTypes)) {
            abort(404);
        }

        $path = storage_path('app/' . $type . '/' . $filename);

        if (!File::exists($path)) {
            abort(404);
        }

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = Response::make($file, 200);
        $response->header("Content-Type", $type);

        return $response;
    }

    /**
     * Endpoint for the API to update the user's cover or avatar.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return App\User
     */
    public function updateProfileImage(Request $request)
    {
        $user = $request->user();
        $data = $request->all();

        $this->imageValidator(
            $data
        )->validate();
        
        $img = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data['image']));
        $dirName = $this->getDirectoryName($data['name']); 
        $filePath = $dirName . '/user_' . (string)$user->id . '.jpg';
        $imgPath = '/profile/' . $filePath;

        Storage::disk('local')->put($filePath, $img);
        
        $user->{$data['name']} = $imgPath;
        $user->save();

        return [
            'message' => 'Profile has been sucessfully updated'
        ];
    }
}