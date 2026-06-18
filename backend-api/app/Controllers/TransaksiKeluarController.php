<?php

namespace App\Controllers;

use App\Models\TransaksiKeluarModel;
use App\Models\PartModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class TransaksiKeluarController extends ResourceController
{
    protected $modelName = TransaksiKeluarModel::class;
    protected $format    = 'json';

    /** GET /api/transaksi-keluar?part_id={id} */
    public function index()
    {
        $partId = $this->request->getGet('part_id');
        $data   = $this->model->getAllWithRelations($partId ? (int) $partId : null);
        return $this->respond(['status' => true, 'data' => $data]);
    }

    /** GET /api/transaksi-keluar/{id} */
    public function show($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Transaksi tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        return $this->respond(['status' => true, 'data' => $item]);
    }

    /**
     * POST /api/transaksi-keluar
     * Validasi stok cukup, lalu kurangi stok part secara atomic
     */
    public function create()
    {
        $body = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'part_id'      => 'required|integer',
            'no_transaksi' => 'required|max_length[50]',
            'jumlah'       => 'required|integer|greater_than[0]',
            'harga_satuan' => 'required|decimal',
            'nama_pembeli' => 'required|max_length[150]',
            'tgl_keluar'   => 'required|valid_date[Y-m-d]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond(['status' => false, 'errors' => $this->validator->getErrors()], ResponseInterface::HTTP_BAD_REQUEST);
        }

        $userId      = $this->request->user['id'];
        $jumlah      = (int)   $body['jumlah'];
        $hargaSatuan = (float) $body['harga_satuan'];
        $totalHarga  = $jumlah * $hargaSatuan;

        // Cek stok cukup sebelum transaksi
        $partModel = new PartModel();
        $part      = $partModel->find($body['part_id']);

        if (!$part) {
            return $this->respond(['status' => false, 'message' => 'Part tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }

        if ($part['stok'] < $jumlah) {
            return $this->respond([
                'status'  => false,
                'message' => "Stok tidak cukup. Stok saat ini: {$part['stok']} {$part['satuan']}.",
            ], ResponseInterface::HTTP_UNPROCESSABLE_ENTITY);
        }

        // Atomic DB transaction
        $db = \Config\Database::connect();
        $db->transStart();

        $id = $this->model->insert([
            'part_id'      => $body['part_id'],
            'user_id'      => $userId,
            'no_transaksi' => $body['no_transaksi'],
            'jumlah'       => $jumlah,
            'harga_satuan' => $hargaSatuan,
            'total_harga'  => $totalHarga,
            'nama_pembeli' => $body['nama_pembeli'],
            'tgl_keluar'   => $body['tgl_keluar'],
            'keterangan'   => $body['keterangan'] ?? null,
        ]);

        // Kurangi stok
        $partModel->kurangiStok((int) $body['part_id'], $jumlah);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Transaksi gagal disimpan.'], ResponseInterface::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->respond([
            'status'  => true,
            'message' => 'Transaksi keluar berhasil. Stok telah dikurangi.',
            'data'    => $this->model->find($id),
        ], ResponseInterface::HTTP_CREATED);
    }

    /** DELETE /api/transaksi-keluar/{id} */
    public function delete($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Transaksi tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        $this->model->delete($id);
        return $this->respond(['status' => true, 'message' => 'Transaksi keluar berhasil dihapus.']);
    }
}
