<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PageHistory extends Model
{
    protected $table = 'pages_history';

    /**
     * Get the page that owns the history.
     */
    public function page()
    {
        return $this->belongsTo('App\Page', 'page_id');
    }

    /**
     * Delete the history of the page.
     *
     * @param string $pageID
     */
    public function deleteHistory($pageID)
    {
        return $this->where('page_id', $pageID)->delete();
    }
}
