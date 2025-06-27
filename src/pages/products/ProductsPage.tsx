import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { fetchProducts, Product } from '../../api/products';
import ProductForm from '../../components/products/ProductForm';
import { createProduct, updateProduct, deleteProduct } from '../../api/products';

const categoryOptions = ['All', 'Electronics', 'Accessories', 'Storage', 'Photography'];
const statusOptions = ['All', 'Active', 'Inactive', 'Out of Stock'];

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = { page };
        if (searchQuery) params.search = searchQuery;
        if (selectedCategory !== 'All') params.category = selectedCategory;
        if (selectedStatus !== 'All') params.status = selectedStatus;
        const data = await fetchProducts(params);
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [searchQuery, page, selectedCategory, selectedStatus]);

  const handleCreateProduct = async (values: Partial<Product>) => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      const newProduct = await createProduct(values as Product);
      setProducts((prev) => [newProduct, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      setCreateError('Failed to create product');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditProduct = async (values: Partial<Product>) => {
    if (!editProduct) return;
    setEditLoading(true);
    setEditError(null);
    try {
      const updated = await updateProduct(editProduct._id!, values);
      setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
      setEditProduct(null);
    } catch (err) {
      setEditError('Failed to update product');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteProduct(deleteProductId);
      setProducts((prev) => prev.filter((p) => p._id !== deleteProductId));
      setDeleteProductId(null);
    } catch (err) {
      setDeleteError('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreateModal(true)}>
          Add Product
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <div className="w-full md:w-72">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={selectedCategory}
                onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
              >
                {categoryOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={selectedStatus}
                onChange={e => { setSelectedStatus(e.target.value); setPage(1); }}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.sku}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>{product.stock}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {product.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => setEditProduct(product)}>
                          <Edit className="inline h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => setDeleteProductId(product._id!)}>
                          <Trash2 className="inline h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">No products found.</div>
              )}
            </div>
          )}
          {products.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Product</h2>
            <ProductForm
              onSubmit={handleCreateProduct}
              onCancel={() => setShowCreateModal(false)}
              loading={createLoading}
            />
            {createError && <div className="text-red-500 text-sm mt-2">{createError}</div>}
          </div>
        </div>
      )}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <ProductForm
              initialValues={editProduct}
              onSubmit={handleEditProduct}
              onCancel={() => setEditProduct(null)}
              loading={editLoading}
            />
            {editError && <div className="text-red-500 text-sm mt-2">{editError}</div>}
          </div>
        </div>
      )}
      {deleteProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Delete Product</h2>
            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            {deleteError && <div className="text-red-500 text-sm mt-2">{deleteError}</div>}
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setDeleteProductId(null)} disabled={deleteLoading}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteProduct} loading={deleteLoading}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;