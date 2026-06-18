<?php

namespace App\Controllers;

use App\Models\PartModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class PartController extends ResourceController
{
    protected $modelName = PartModel::class;
    protected $format    = 'json';

    /** GET /api/part */
    public function index()
    {
        $data = $this->model->getAllWithRelations();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    /** GET /api/part/{id} */
    public function show($id = null)
    {
        $item = $this->model->getOneWithRelations((int) $id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Part tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        return $this->respond(['status' => true, 'data' => $item]);
    }

    /** POST /api/part */
    public function create()
    {
        $body = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'kode_part'    => 'required|max_length[50]|is_unique[part.kode_part]',
            'nama_part'    => 'required|min_length[3]|max_length[200]',
            'kategori_id'  => 'required|integer',
            'brand_id'     => 'required|integer',
            'supplier_id'  => 'required|integer',
            'harga_beli'   => 'required|decimal',
            'harga_jual'   => 'required|decimal',
            'stok'         => 'required|integer',
            'stok_minimum' => 'required|integer',
            'satuan'       => 'required|in_list[pcs,unit]',
            'status'       => 'permit_empty|in_list[aktif,discontinue]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond(['status' => false, 'errors' => $this->validator->getErrors()], ResponseInterface::HTTP_BAD_REQUEST);
        }

        $id = $this->model->insert([
            'kode_part'    => $body['kode_part'],
            'nama_part'    => $body['nama_part'],
            'kategori_id'  => $body['kategori_id'],
            'brand_id'     => $body['brand_id'],
            'supplier_id'  => $body['supplier_id'],
            'spesifikasi'  => $body['spesifikasi']  ?? null,
            'harga_beli'   => $body['harga_beli'],
            'harga_jual'   => $body['harga_jual'],
            'stok'         => $body['stok']         ?? 0,
            'stok_minimum' => $body['stok_minimum'] ?? 5,
            'satuan'       => $body['satuan']        ?? 'pcs',
            'gambar_url'   => $body['gambar_url']   ?? null,
            'status'       => $body['status']        ?? 'aktif',
        ]);

        return $this->respond([
            'status'  => true,
            'message' => 'Part berhasil ditambahkan.',
            'data'    => $this->model->getOneWithRelations($id),
        ], ResponseInterface::HTTP_CREATED);
    }

    /** PUT /api/part/{id} */
    public function update($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Part tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }

        $body = $this->request->getJSON(true) ?? $this->request->getRawInput();

        // Validasi kode_part unik kecuali untuk record ini sendiri
        $rules = [
            'kode_part' => "permit_empty|max_length[50]|is_unique[part.kode_part,id,{$id}]",
            'satuan'    => 'permit_empty|in_list[pcs,unit]',
            'status'    => 'permit_empty|in_list[aktif,discontinue]',
        ];

        if (!$this->validate($rules)) {
            return $this->respond(['status' => false, 'errors' => $this->validator->getErrors()], ResponseInterface::HTTP_BAD_REQUEST);
        }

        $this->model->update($id, [
            'kode_part'    => $body['kode_part']    ?? $item['kode_part'],
            'nama_part'    => $body['nama_part']    ?? $item['nama_part'],
            'kategori_id'  => $body['kategori_id']  ?? $item['kategori_id'],
            'brand_id'     => $body['brand_id']     ?? $item['brand_id'],
            'supplier_id'  => $body['supplier_id']  ?? $item['supplier_id'],
            'spesifikasi'  => $body['spesifikasi']  ?? $item['spesifikasi'],
            'harga_beli'   => $body['harga_beli']   ?? $item['harga_beli'],
            'harga_jual'   => $body['harga_jual']   ?? $item['harga_jual'],
            'stok'         => $body['stok']         ?? $item['stok'],
            'stok_minimum' => $body['stok_minimum'] ?? $item['stok_minimum'],
            'satuan'       => $body['satuan']        ?? $item['satuan'],
            'gambar_url'   => $body['gambar_url']   ?? $item['gambar_url'],
            'status'       => $body['status']        ?? $item['status'],
        ]);

        return $this->respond([
            'status'  => true,
            'message' => 'Part berhasil diupdate.',
            'data'    => $this->model->getOneWithRelations((int) $id),
        ]);
    }

    /** DELETE /api/part/{id} */
    public function delete($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Part tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        $this->model->delete($id);
        return $this->respond(['status' => true, 'message' => 'Part berhasil dihapus.']);
    }

    /**
     * GET /api/part/stok-menipis
     * Daftar part dengan stok <= stok_minimum
     */
    public function stokMenipis()
    {
        $data = $this->model->getStokMenipis();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    /**
     * GET /api/part/dashboard-stats
     * Statistik untuk Dashboard
     */
    public function dashboardStats()
    {
        $stats = $this->model->getDashboardStats();
        return $this->respond(['status' => true, 'data' => $stats]);
    }
}
