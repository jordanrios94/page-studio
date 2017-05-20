<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Get the pages the user has created.
     */
    public function pages()
    {
        return $this->hasMany('App\Page', 'creator_user_id');
    }

    /**
     * Get the likes the user has made on the site.
     */
     public function likes()
     {
         return $this->hasMany('App\PageLike', 'user_id');
     }
}
