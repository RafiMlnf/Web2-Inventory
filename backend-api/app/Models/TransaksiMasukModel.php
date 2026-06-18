<?php

namespace App\Models;

use CodeIgniter\Model;

class TransaksiMasukModel extends Model
{
    protected $table         = 'transaksi_masuk';
    protected $primaryKey    = 'id';
    protected $useAutoIncrement = true;
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'part_id', 'supplier_id', 'user_id', 'no_invoice',
        'jumlah', 'harga_satuan', 'total_harga',
        'tgl_masuk', 'keterangan',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';

    protected $validationRules = [
        'part_id'      => 'required|integer',
        'supplier_id'  => 'required|integer',
        'no_invoice'   => 'required|max_length[50]',
        'jumlah'       => 'required|integer|greater_than[0]',
        'harga_satuan' => 'required|decimal',
        'tgl_masuk'    => 'required|valid_date[Y-m-d]',
    ];

    /**
     * Ambil semua transaksi masuk dengan relasi part, supplier, user
     */
    public function getAllWithRelations(?int $partId = null): array
    {
        $builder = $this->select(
            'transaksi_masuk.*, p.nama_part, p.kode_part, s.nama_supplier, u.nama as nama_user'
        )
            ->join('part p', 'p.id = transaksi_masuk.part_id', 'left')
            ->join('supplier s', 's.id = transaksi_masuk.supplier_id', 'left')
            ->join('users u', 'u.id = transaksi_masuk.user_id', 'left')
            ->orderBy('transaksi_masuk.id', 'DESC');

        if ($partId !== null) {
            $builder->where('transaksi_masuk.part_id', $partId);
        }

        return $builder->findAll();
    }

    /**
     * Total transaksi masuk untuk dashboard
     */
    public function getTotalTransaksi(): array
    {
        $total = $this->db->query(
            'SELECT COUNT(*) as jumlah_transaksi, SUM(total_harga) as total_nilai FROM transaksi_masuk'
        )->getRow();

        return [
            'jumlah_transaksi' => (int)   ($total->jumlah_transaksi ?? 0),
            'total_nilai'      => (float)  ($total->total_nilai ?? 0),
        ];
    }
}
