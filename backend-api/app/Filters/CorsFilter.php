<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class CorsFilter implements FilterInterface
{
    /**
     * Tambahkan CORS headers untuk semua response.
     * Handle OPTIONS preflight request.
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        // Handle preflight OPTIONS request
        if ($request->getMethod() === 'options') {
            $response = service('response');
            $response->setHeader('Access-Control-Allow-Origin', '*')
                     ->setHeader('Access-Control-Allow-Headers', 'Origin, X-API-KEY, Content-Type, Accept, Authorization, X-Requested-With')
                     ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
                     ->setHeader('Access-Control-Max-Age', '3600')
                     ->setStatusCode(200);
            return $response;
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $response->setHeader('Access-Control-Allow-Origin', '*')
                 ->setHeader('Access-Control-Allow-Headers', 'Origin, X-API-KEY, Content-Type, Accept, Authorization, X-Requested-With')
                 ->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

        return $response;
    }
}
