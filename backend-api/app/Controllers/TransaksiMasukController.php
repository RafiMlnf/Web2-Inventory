<?php

namespace App\Controllers;

use App\Models\TransaksiMasukModel;
use App\Models\PartModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class TransaksiMasukController extends ResourceController
{
    protected $modelName = TransaksiMasukModel::class;
    protected $format    = 'json';

    /** GET /api/transaksi-masuk?part_id={id} */
    public function index()
    {
        $partId = $this->request->getGet('part_id');
        $data   = $this->model->getAllWithRelations($partId ? (int) $partId : null);
        return $this->respond(['status' => true, 'data' => $data]);
    }

    /** GET /api/transaksi-masuk/{id} */
    public function show($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Transaksi tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        return $this->respond(['status' => true, 'data' => $item]);
    }

    /**
     * POST /api/transaksi-masuk
     * Otomatis tambah stok part
     */
    public function create()
    {
        $body = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'part_id'      => 'required|integer',
            'supplier_id'  => 'required|integer',
            'no_invoice'   => 'required|max_length[50]',
            'jumlah'       => 'required|integer|greater_than[0]',
            'harga_satuan' => 'required|decimal',
            'tgl_masuk'    => 'required|valid_date[Y-m-d]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond(['status' => false, 'errors' => $this->validator->getErrors()], ResponseInterface::HTTP_BAD_REQUEST);
        }

        // Ambil user dari token (diset oleh AuthFilter)
        $userId      = $this->request->user['id'];
        $jumlah      = (int)   $body['jumlah'];
        $hargaSatuan = (float) $body['harga_satuan'];
        $totalHarga  = $jumlah * $hargaSatuan;

        // Gunakan DB transaction agar atomic
        $db = \Config\Database::connect();
        $db->transStart();

        $id = $this->model->insert([
            'part_id'      => $body['part_id'],
            'supplier_id'  => $body['supplier_id'],
            'user_id'      => $userId,
            'no_invoice'   => $body['no_invoice'],
            'jumlah'       => $jumlah,
            'harga_satuan' => $hargaSatuan,
            'total_harga'  => $totalHarga,
            'tgl_masuk'    => $body['tgl_masuk'],
            'keterangan'   => $body['keterangan'] ?? null,
        ]);

        // Update stok part
        $partModel = new PartModel();
        $partModel->tambahStok((int) $body['part_id'], $jumlah);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->respond(['status' => false, 'message' => 'Transaksi gagal disimpan.'], ResponseInterface::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->respond([
            'status'  => true,
            'message' => 'Transaksi masuk berhasil. Stok telah diupdate.',
            'data'    => $this->model->find($id),
        ], ResponseInterface::HTTP_CREATED);
    }

    /**
     * DELETE /api/transaksi-masuk/{id}
     * Hapus transaksi (tidak rollback stok — sesuai brief)
     */
    public function delete($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Transaksi tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        $this->model->delete($id);
        return $this->respond(['status' => true, 'message' => 'Transaksi masuk berhasil dihapus.']);
    }
}
