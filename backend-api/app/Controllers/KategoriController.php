<?php

namespace App\Controllers;

use App\Models\KategoriModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class KategoriController extends ResourceController
{
    protected $modelName = KategoriModel::class;
    protected $format    = 'json';

    /** GET /api/kategori */
    public function index()
    {
        $data = $this->model->orderBy('id', 'ASC')->findAll();
        return $this->respond([
            'status' => true,
            'data'   => $data,
        ]);
    }

    /** GET /api/kategori/{id} */
    public function show($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Kategori tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        return $this->respond(['status' => true, 'data' => $item]);
    }

    /** POST /api/kategori */
    public function create()
    {
        $body = $this->request->getJSON(true) ?? $this->request->getPost();
        $rules = [
            'nama_kategori' => 'required|min_length[2]|max_length[100]',
        ];
        if (!$this->validate($rules)) {
            return $this->respond(['status' => false, 'errors' => $this->validator->getErrors()], ResponseInterface::HTTP_BAD_REQUEST);
        }

        $id = $this->model->insert([
            'nama_kategori' => $body['nama_kategori'],
            'deskripsi'     => $body['deskripsi'] ?? null,
        ]);

        return $this->respond([
            'status'  => true,
            'message' => 'Kategori berhasil ditambahkan.',
            'data'    => $this->model->find($id),
        ], ResponseInterface::HTTP_CREATED);
    }

    /** PUT /api/kategori/{id} */
    public function update($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Kategori tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }

        $body = $this->request->getJSON(true) ?? $this->request->getRawInput();

        $this->model->update($id, [
            'nama_kategori' => $body['nama_kategori'] ?? $item['nama_kategori'],
            'deskripsi'     => $body['deskripsi']     ?? $item['deskripsi'],
        ]);

        return $this->respond([
            'status'  => true,
            'message' => 'Kategori berhasil diupdate.',
            'data'    => $this->model->find($id),
        ]);
    }

    /** DELETE /api/kategori/{id} */
    public function delete($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Kategori tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }

        $this->model->delete($id);
        return $this->respond(['status' => true, 'message' => 'Kategori berhasil dihapus.']);
    }
}
