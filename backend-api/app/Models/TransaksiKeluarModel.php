<?php

namespace App\Models;

use CodeIgniter\Model;

class TransaksiKeluarModel extends Model
{
    protected $table         = 'transaksi_keluar';
    protected $primaryKey    = 'id';
    protected $useAutoIncrement = true;
    protected $returnType    = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'part_id', 'user_id', 'no_transaksi', 'jumlah',
        'harga_satuan', 'total_harga', 'nama_pembeli',
        'tgl_keluar', 'keterangan',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = '';

    protected $validationRules = [
        'part_id'      => 'required|integer',
        'no_transaksi' => 'required|max_length[50]',
        'jumlah'       => 'required|integer|greater_than[0]',
        'harga_satuan' => 'required|decimal',
        'nama_pembeli' => 'required|max_length[150]',
        'tgl_keluar'   => 'required|valid_date[Y-m-d]',
    ];

    /**
     * Ambil semua transaksi keluar dengan relasi part dan user
     */
    public function getAllWithRelations(?int $partId = null): array
    {
        $builder = $this->select(
            'transaksi_keluar.*, p.nama_part, p.kode_part, u.nama as nama_user'
        )
            ->join('part p', 'p.id = transaksi_keluar.part_id', 'left')
            ->join('users u', 'u.id = transaksi_keluar.user_id', 'left')
            ->orderBy('transaksi_keluar.id', 'DESC');

        if ($partId !== null) {
            $builder->where('transaksi_keluar.part_id', $partId);
        }

        return $builder->findAll();
    }

    /**
     * Total transaksi keluar untuk dashboard
     */
    public function getTotalTransaksi(): array
    {
        $total = $this->db->query(
            'SELECT COUNT(*) as jumlah_transaksi, SUM(total_harga) as total_nilai FROM transaksi_keluar'
        )->getRow();

        return [
            'jumlah_transaksi' => (int)   ($total->jumlah_transaksi ?? 0),
            'total_nilai'      => (float)  ($total->total_nilai ?? 0),
        ];
    }
}
