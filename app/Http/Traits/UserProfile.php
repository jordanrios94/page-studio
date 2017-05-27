<?php

namespace App\Http\Traits;

trait UserProfile
{
    /**
     * This method is used to get the name of the folder where the image will be stored.
     *
     * @param  string  $name
     * @return string
     */
    public function getDirectoryName($name)
    {
        switch ($name) {
            case 'cover_url':
                return 'cover';
            case 'profile_url':
                return 'avatar';
            default:
                abort(500);
                break;
        }
    }
}
