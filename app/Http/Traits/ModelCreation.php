<?php

namespace App\Http\Traits;

trait ModelCreation
{
    /**
     * This method is used to generate a new ID for record.
     *
     * @param  int    $length
     * @return string
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
}
