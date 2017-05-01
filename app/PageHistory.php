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
        return $this->belongsTo('App\Page', 'id');
    }
}
