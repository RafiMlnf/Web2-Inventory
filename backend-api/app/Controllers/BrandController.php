<?php

namespace App\Controllers;

use App\Models\BrandModel;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\RESTful\ResourceController;

class BrandController extends ResourceController
{
    protected $modelName = BrandModel::class;
    protected $format    = 'json';

    /** GET /api/brand */
    public function index()
    {
        $data = $this->model->orderBy('id', 'ASC')->findAll();
        return $this->respond(['status' => true, 'data' => $data]);
    }

    /** GET /api/brand/{id} */
    public function show($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Brand tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        return $this->respond(['status' => true, 'data' => $item]);
    }

    /** POST /api/brand */
    public function create()
    {
        $body = $this->request->getJSON(true) ?? $this->request->getPost();
        $rules = ['nama_brand' => 'required|min_length[2]|max_length[100]'];
        if (!$this->validate($rules)) {
            return $this->respond(['status' => false, 'errors' => $this->validator->getErrors()], ResponseInterface::HTTP_BAD_REQUEST);
        }

        $id = $this->model->insert([
            'nama_brand' => $body['nama_brand'],
            'logo_url'   => $body['logo_url'] ?? null,
        ]);

        return $this->respond([
            'status'  => true,
            'message' => 'Brand berhasil ditambahkan.',
            'data'    => $this->model->find($id),
        ], ResponseInterface::HTTP_CREATED);
    }

    /** PUT /api/brand/{id} */
    public function update($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Brand tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        $body = $this->request->getJSON(true) ?? $this->request->getRawInput();

        $this->model->update($id, [
            'nama_brand' => $body['nama_brand'] ?? $item['nama_brand'],
            'logo_url'   => $body['logo_url']   ?? $item['logo_url'],
        ]);

        return $this->respond(['status' => true, 'message' => 'Brand berhasil diupdate.', 'data' => $this->model->find($id)]);
    }

    /** DELETE /api/brand/{id} */
    public function delete($id = null)
    {
        $item = $this->model->find($id);
        if (!$item) {
            return $this->respond(['status' => false, 'message' => 'Brand tidak ditemukan.'], ResponseInterface::HTTP_NOT_FOUND);
        }
        $this->model->delete($id);
        return $this->respond(['status' => true, 'message' => 'Brand berhasil dihapus.']);
    }
}
