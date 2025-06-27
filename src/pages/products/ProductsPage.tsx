import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const PRODUCTS = [
  { 
    id: 1, 
    name: 'Wireless Earbuds', 
    sku: 'WE-001', 
    category: 'Electronics', 
    price: 89.99, 
    stock: 45, 
    status: 'Active' 
  },
  { 
    id: 2, 
    name: 'Smart Watch', 
    sku: 'SW-002', 
    category: 'Electronics', 
    price: 199.99, 
    stock: 28, 
    status: 'Active' 
  },
  { 
    id: 3, 
    name: 'Bluetooth Speaker', 
    sku: 'BS-003', 
    category: 'Electronics', 
    price: 59.99, 
    stock: 12, 
    status: 'Active' 
  },
  { 
    id: 4, 
    name: 'USB-C Cable', 
    sku: 'UC-004', 
    category: 'Accessories', 
    price: 14.99, 
    stock: 86, 
    status: 'Active' 
  },
  { 
    id: 5, 
    name: 'Laptop Sleeve', 
    sku: 'LS-005', 
    category: 'Accessories', 
    price: 24.99, 
    stock: 32, 
    status: 'Active' 
  },
  { 
    id: 6, 
    name: 'Wireless Mouse', 
    sku: 'WM-006', 
    category: 'Electronics', 
    price: 29.99, 
    stock: 54, 
    status: 'Active' 
  },
  { 
    id: 7, 
    name: 'External SSD 1TB', 
    sku: 'ES-007', 
    category: 'Storage', 
    price: 149.99, 
    stock: 18, 
    status: 'Active' 
  },
  { 
    id: 8, 
    name: 'Camera Tripod', 
    sku: 'CT-008', 
    category: 'Photography', 
    price: 39.99, 
    stock: 23, 
    status: 'Active' 
  }
];

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            <div className="w-full md:w-72">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4 text-gray-400" />}
              />
            </div>
          </div>
          
          {/* Products table */}
          <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
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
                      <div className={`text-sm ${product.stock < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {product.stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-gray-500 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-gray-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">8</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                Next
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsPage;