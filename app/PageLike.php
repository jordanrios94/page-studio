<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PageLike extends Model
{
    protected $table = 'pages_likes';

    /**
     * Get the page that owns the like.
     */
    public function page()
    {
        return $this->belongsTo('App\Page', 'page_id');
    }

    /**
     * Get the user that owns the like.
     */
    public function user()
    {
        return $this->belongsTo('App\User', 'user_id');
    }

    /**
     * Get the liked the page by the user.
     *
     * @param  int    $userID
     * @param  string $pageID
     */
    public function get($userID, $pageID)
    {
        return $this->where([
            ['user_id', '=', $userID],
            ['page_id', '=', $pageID]
        ])->first();
    }

    /**
     * Delete the likes of the page.
     *
     * @param string $pageID
     */
    public function deleteLikes($pageID)
    {
        return $this->where('page_id', $pageID)->delete();
    }
}
