<?php

namespace App\Http\Helpers;

class PageHelper
{
    public static function generateId($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $idString = '';

        for ($i = 0; $i < $length; $i++) {
            $idString .= $characters[rand(0, $charactersLength - 1)];
        }

        return $idString;
    }
}
