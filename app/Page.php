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
     * Get the likes for the page.
     */
    public function likes()
    {
        return $this->hasMany('App\PageLike', 'page_id');
    }

    /**
     * Get the page using its ID.
     *
     * @param string $id
     * @return App\Page
     */
    public function getPage($id)
    {
        return $this->where('id', $id)->withCount('likes')->firstOrFail();
    }

    /**
     * Get the latest page details using its ID.
     *
     * @param string $id
     * @return array
     */
    public function getLatestPage($id)
    {
        $page = $this->getPage($id);
        $latestVersion = $page->versions()->orderBy('created_at', 'desc')->firstOrFail();

        return [
            'page' => $page,
            'version' => $latestVersion
        ];
    }
}
