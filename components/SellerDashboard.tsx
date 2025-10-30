
import React, { useState } from 'react';
import { Condition, Product } from '../types';
import { apiService } from '../services/apiService';

interface SellerDashboardProps {
    onProductAdded: (newProduct: Product) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ onProductAdded }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock data
    const totalEarnings = 4750;
    const pendingPayout = 850;
    const activeListings = 15;
    const orders = [
        { id: 'ORD-001', item: 'Air Jordan 13 Retro', date: '2023-10-26', status: 'Shipped', price: 210 },
        { id: 'ORD-002', item: 'Nike Little Posite One', date: '2023-10-25', status: 'Delivered', price: 90 },
        { id: 'ORD-003', item: 'Air Jordan 12 Retro', date: '2023-10-24', status: 'Processing', price: 140 },
    ];
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        // FIX: Removed the `images` property from this object. The `apiService.addProduct` method
        // expects an object where `images` is omitted, so including it was causing a type error.
        const newProductData = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            brand: formData.get('brand') as string,
            size: Number(formData.get('size')),
            condition: formData.get('condition') as Condition,
            priceUSD: Number(formData.get('priceUSD')),
            category: 'Shoes', // default
        };

        try {
            const newProduct = await apiService.addProduct(newProductData);
            onProductAdded(newProduct);
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Failed to add product", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Seller Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h3 className="text-sm font-medium text-gray-400">Total Earnings</h3>
                            <p className="text-3xl font-bold text-green-500 mt-2">${totalEarnings.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h3 className="text-sm font-medium text-gray-400">Pending Payout</h3>
                            <p className="text-3xl font-bold text-yellow-500 mt-2">${pendingPayout.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                            <h3 className="text-sm font-medium text-gray-400">Active Listings</h3>
                            <p className="text-3xl font-bold text-blue-500 mt-2">{activeListings}</p>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                        <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="p-3 text-sm font-semibold text-gray-400">Order ID</th>
                                        <th className="p-3 text-sm font-semibold text-gray-400">Item</th>
                                        <th className="p-3 text-sm font-semibold text-gray-400">Date</th>
                                        <th className="p-3 text-sm font-semibold text-gray-400">Status</th>
                                        <th className="p-3 text-sm font-semibold text-gray-400 text-right">Price (USD)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                            <td className="p-3 text-brand-green font-mono">{order.id}</td>
                                            <td className="p-3">{order.item}</td>
                                            <td className="p-3 text-gray-400">{order.date}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    order.status === 'Shipped' ? 'bg-blue-900 text-blue-300' :
                                                    order.status === 'Delivered' ? 'bg-green-900 text-green-300' :
                                                    'bg-yellow-900 text-yellow-300'
                                                }`}>{order.status}</span>
                                            </td>
                                            <td className="p-3 text-right font-semibold">${order.price.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* List New Sneaker Form */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 h-fit">
                    <h2 className="text-xl font-semibold text-white mb-4">List New Sneaker</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-300">Title</label>
                            <input type="text" name="title" id="title" required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                        </div>
                         <div>
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-300">Brand</label>
                            <input type="text" name="brand" id="brand" required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="size" className="block text-sm font-medium text-gray-300">Size (US)</label>
                                <input type="number" step="0.5" name="size" id="size" required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                            </div>
                            <div>
                                <label htmlFor="priceUSD" className="block text-sm font-medium text-gray-300">Price (USD)</label>
                                <input type="number" step="0.01" name="priceUSD" id="priceUSD" required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="condition" className="block text-sm font-medium text-gray-300">Condition</label>
                            <select name="condition" id="condition" required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green">
                                {Object.values(Condition).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
                            <textarea name="description" id="description" rows={3} required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green"></textarea>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="w-full bg-brand-green text-brand-dark py-2.5 rounded-md font-semibold hover:brightness-90 transition-all disabled:opacity-50 disabled:cursor-wait">
                            {isSubmitting ? 'Listing...' : 'List Sneaker'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
