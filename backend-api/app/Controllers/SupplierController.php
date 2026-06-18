<?php

namespace App\Controllers;

use App\Models\SupplierModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class SupplierController extends ResourceController
{
    protected $modelName = SupplierModel::class;
    protected $format    = 'json';

    /** GET /api/supplier */
    public function index()
    {
        $data = $this->model->orderBy('id', 'ASC')->findAll();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    /** GET /api/supplier/{id} */
    public function show($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Supplier tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        return $this->respond(['status' => true, 'data' => $item]);
    }

    /** POST /api/supplier */
    public function create()
    {
        $body = $this->request->getJSON(true) ?? $this->request->getPost();
        $rules = [
            'nama_supplier' => 'required|min_length[3]|max_length[150]',
            'email'         => 'permit_empty|valid_email',
        ];
        if (!$this->validate($rules)) {
            return $this->respond(['status' => false, 'errors' => $this->validator->getErrors()], ResponseInterface::HTTP_BAD_REQUEST);
        }

        $id = $this->model->insert([
            'nama_supplier' => $body['nama_supplier'],
            'alamat'        => $body['alamat']        ?? null,
            'no_telp'       => $body['no_telp']       ?? null,
            'email'         => $body['email']         ?? null,
            'kontak_person' => $body['kontak_person'] ?? null,
        ]);

        return $this->respond([
            'status'  => true,
            'message' => 'Supplier berhasil ditambahkan.',
            'data'    => $this->model->find($id),
        ], ResponseInterface::HTTP_CREATED);
    }

    /** PUT /api/supplier/{id} */
    public function update($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Supplier tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        $body = $this->request->getJSON(true) ?? $this->request->getRawInput();

        $this->model->update($id, [
            'nama_supplier' => $body['nama_supplier'] ?? $item['nama_supplier'],
            'alamat'        => $body['alamat']        ?? $item['alamat'],
            'no_telp'       => $body['no_telp']       ?? $item['no_telp'],
            'email'         => $body['email']         ?? $item['email'],
            'kontak_person' => $body['kontak_person'] ?? $item['kontak_person'],
        ]);

        return $this->respond(['status' => true, 'message' => 'Supplier berhasil diupdate.', 'data' => $this->model->find($id)]);
    }

    /** DELETE /api/supplier/{id} */
    public function delete($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Supplier tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        $this->model->delete($id);
        return $this->respond(['status' => true, 'message' => 'Supplier berhasil dihapus.']);
    }
}
