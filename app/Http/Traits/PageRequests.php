<?php

namespace App\Http\Traits;

trait PageRequests
{
    /**
     * This method is used to get the paginated pages.
     *
     * @param  App\User     $creator
     * @param  App\User     $user
     * @param  App\PageLike $pageLike
     * @return Illuminate\Database\Eloquent\Collection
     */
    public function getPaginatedPages($creator, $user, $pageLike)
    {
        $userID = empty($user) ? 0 : $user->id;

        $pages = $creator
            ->pages()
            ->withCount('likes')
            ->orderBy('created_at', 'desc')
            ->paginate(8);

        foreach ($pages as $page) {
            $like = $pageLike->get($userID, $page->id);
            $page->hasLiked = !empty($like);
        }

        return $pages;
    }
}
