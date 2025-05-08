import React from 'react';
import { ArrowUp, ArrowDown, DollarSign, Package, ShoppingCart, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your inventory and business performance</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
          >
            Export
          </Button>
          <Button
            size="sm"
          >
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">$24,780</h3>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-xs font-medium ml-1">12%</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">From previous period</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Products</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">142</h3>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-xs font-medium ml-1">8%</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">From previous period</span>
                </div>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Orders</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">38</h3>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-red-600">
                    <ArrowDown className="h-4 w-4" />
                    <span className="text-xs font-medium ml-1">4%</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">From previous period</span>
                </div>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <ShoppingCart className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Customers</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">512</h3>
                <div className="flex items-center mt-2">
                  <div className="flex items-center text-green-600">
                    <ArrowUp className="h-4 w-4" />
                    <span className="text-xs font-medium ml-1">16%</span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">From previous period</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Chart would go here - using a placeholder */}
            <div className="h-80 bg-gray-50 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Sales Chart</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Status</CardTitle>
            <CardDescription>Products with low stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Wireless Earbuds</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Electronics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">5</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Smart Watch</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Electronics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">8</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Medium Stock
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Bluetooth Speaker</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Electronics</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">3</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">USB-C Cable</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">Accessories</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">25</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        In Stock
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">New product added</p>
                <p className="text-sm text-gray-500">Smart Watch - Black Edition</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">New order received</p>
                <p className="text-sm text-gray-500">Order #12345 - $230.00</p>
                <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">New customer registered</p>
                <p className="text-sm text-gray-500">John Smith</p>
                <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                  <Package className="h-4 w-4" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Stock updated</p>
                <p className="text-sm text-gray-500">Wireless Earbuds - 10 units added</p>
                <p className="text-xs text-gray-400 mt-1">Yesterday</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;