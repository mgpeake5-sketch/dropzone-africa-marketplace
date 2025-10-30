
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { User, Product } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [fetchedUsers, fetchedProducts] = await Promise.all([
          apiService.fetchAllUsers(),
          apiService.fetchProducts(),
        ]);
        setUsers(fetchedUsers);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
            <p className="text-gray-400">Loading platform data...</p>
        </div>
    )
  }

  const totalSales = products.filter(p => p.status === 'Sold').reduce((acc, p) => acc + p.priceUSD, 0);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <button onClick={onBack} className="mb-6 text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center">
            &larr; Back to Home
        </button>
        <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                <p className="text-3xl font-bold text-blue-500 mt-2">{users.length}</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Total Products</h3>
                <p className="text-3xl font-bold text-yellow-500 mt-2">{products.length}</p>
            </div>
             <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Total Sales (USD)</h3>
                <p className="text-3xl font-bold text-green-500 mt-2">${totalSales.toLocaleString()}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* User List */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Users</h2>
                <div className="overflow-y-auto max-h-96">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700 sticky top-0 bg-gray-900">
                                <th className="p-3 text-sm font-semibold text-gray-400">Name</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Email</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-3 flex items-center space-x-3">
                                        <img src={user.profilePhoto} alt={user.name} className="h-8 w-8 rounded-full" />
                                        <span>{user.name}</span>
                                    </td>
                                    <td className="p-3 text-gray-400">{user.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.role === 'Admin' ? 'bg-purple-900 text-purple-300' :
                                            user.role === 'Seller' ? 'bg-green-900 text-green-300' :
                                            'bg-blue-900 text-blue-300'
                                        }`}>{user.role}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product List */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-4">Products</h2>
                <div className="overflow-y-auto max-h-96">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-700 sticky top-0 bg-gray-900">
                                <th className="p-3 text-sm font-semibold text-gray-400">Title</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Brand</th>
                                <th className="p-3 text-sm font-semibold text-gray-400">Status</th>
                                <th className="p-3 text-sm font-semibold text-gray-400 text-right">Price (USD)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-3">{product.title}</td>
                                    <td className="p-3 text-gray-400">{product.brand}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            product.status === 'Active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                        }`}>{product.status}</span>
                                    </td>
                                    <td className="p-3 text-right font-semibold">${product.priceUSD.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};
