<?php

namespace App\Filters;

use App\Models\UserModel;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    /**
     * Cek Bearer Token sebelum request diproses.
     * Jika token tidak ada / tidak valid → return 401 Unauthorized.
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        $authHeader = $request->getHeaderLine('Authorization');

        if (!$authHeader || !preg_match('/Bearer\s+(.+)/i', $authHeader, $matches)) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Unauthorized. Token tidak ditemukan. Harap login terlebih dahulu.',
                ]);
        }

        $token = $matches[1];
        $model = new UserModel();
        $user  = $model->findByToken($token);

        if (!$user) {
            return service('response')
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status'  => false,
                    'message' => 'Unauthorized. Token tidak valid atau sudah expired.',
                ]);
        }

        // Simpan data user di request agar bisa diakses controller
        $request->user = $user;

        return $request;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Tidak ada aksi after
    }
}
