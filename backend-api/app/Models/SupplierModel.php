<?php

namespace App\Models;

use CodeIgniter\Model;

class SupplierModel extends Model
{
    protected $table         = 'supplier';
    protected $primaryKey    = 'id';
    protected $useAutoIncrement = true;
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = ['nama_supplier', 'alamat', 'no_telp', 'email', 'kontak_person'];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';

    protected $validationRules = [
        'nama_supplier' => 'required|min_length[3]|max_length[150]',
        'email'         => 'permit_empty|valid_email|max_length[150]',
        'no_telp'       => 'permit_empty|max_length[20]',
    ];
}
