<?php

namespace App\Http\Traits;

trait PageCreation
{
    /**
     * This method is used to generate a new ID for record.
     *
     * @param   int    $length
     * @return  string
     */
    public function generateId($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $idString = '';

        for ($i = 0; $i < $length; $i++) {
            $idString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $idString;
    }

    /**
     * This method is used to determine the type of page
     *
     * @param   string  $route
     * @return  string
     */
    public function getPageType($route)
    {
        return (strpos($route, 'bootstrap') !== false) ? 'bootstrap' : 'basic';
    }
}
