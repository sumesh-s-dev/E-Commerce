import axios from 'axios';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  lowStockThreshold?: number;
  images?: string[];
  status?: string;
  createdBy?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export async function fetchProducts(params?: any) {
  const res = await axios.get<ProductListResponse>('/api/products', { params, withCredentials: true });
  return res.data;
}

export async function fetchProduct(id: string) {
  const res = await axios.get<Product>(`/api/products/${id}`, { withCredentials: true });
  return res.data;
}

export async function createProduct(product: Product) {
  const res = await axios.post<Product>('/api/products', product, { withCredentials: true });
  return res.data;
}

export async function updateProduct(id: string, product: Partial<Product>) {
  const res = await axios.put<Product>(`/api/products/${id}`, product, { withCredentials: true });
  return res.data;
}

export async function deleteProduct(id: string) {
  const res = await axios.delete<{ message: string }>(`/api/products/${id}`, { withCredentials: true });
  return res.data;
} 