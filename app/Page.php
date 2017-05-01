<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    public $incrementing = false;

    /**
     * Get the version history for the page.
     */
    public function versions()
    {
        return $this->hasMany('App\PageHistory', 'page_id');
    }

    /**
     * Get the latest page details using an ID
     *
     * @param string $id
     * @return array
     */
    public function getLatestPage($id)
    {
        $page = $this->where('id', $id)->firstOrFail();
        $latestVersion = $page->versions()->orderBy('created_at', 'desc')->firstOrFail();

        return [
            'page' => $page,
            'version' => $latestVersion
        ];
    }
}
