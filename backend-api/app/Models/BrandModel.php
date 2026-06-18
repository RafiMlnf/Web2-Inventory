<?php

namespace App\Models;

use CodeIgniter\Model;

class BrandModel extends Model
{
    protected $table         = 'brand';
    protected $primaryKey    = 'id';
    protected $useAutoIncrement = true;
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['nama_brand', 'logo_url'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';

    protected $validationRules = [
        'nama_brand' => 'required|min_length[2]|max_length[100]',
        'logo_url'   => 'permit_empty|max_length[255]',
    ];
}
