
import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { formatCurrency, calculateFinalPrice } from '../utils/pricing';

interface CheckoutProps {
    items: CartItem[];
    onPlaceOrder: (shippingAddress: Order['shippingAddress']) => void;
    onBack: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ items, onPlaceOrder, onBack }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    
    const subtotalZAR = items.reduce((acc, item) => {
        const { finalZAR } = calculateFinalPrice(item.priceUSD);
        return acc + (finalZAR * item.quantity);
    }, 0);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsProcessing(true);
        const formData = new FormData(e.currentTarget);
        const shippingAddress = {
            name: formData.get('name') as string,
            address: formData.get('address') as string,
            city: formData.get('city') as string,
            zip: formData.get('zip') as string,
        };
        // The setTimeout simulates network latency for the API call
        setTimeout(() => {
            onPlaceOrder(shippingAddress);
        }, 1500);
    }

    if (items.length === 0) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                 <h1 className="text-3xl font-bold text-white mb-6">Your Cart is Empty</h1>
                 <button onClick={onBack} className="text-brand-green hover:brightness-90">
                    &larr; Continue Shopping
                </button>
             </div>
        )
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
             <button onClick={onBack} className="mb-6 text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center">
                &larr; Back to Cart
            </button>
            <h1 className="text-3xl font-bold text-white mb-8 text-center">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Order Summary */}
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 h-fit">
                    <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-gray-300">
                                <div className="flex items-center space-x-4">
                                    <img src={item.images[0]} alt={item.title} className="h-16 w-16 rounded-md object-cover" />
                                    <div>
                                        <p className="font-semibold text-white">{item.title}</p>
                                        <p className="text-sm">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p>{formatCurrency(calculateFinalPrice(item.priceUSD).finalZAR * item.quantity, 'ZAR')}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-700 mt-6 pt-4">
                        <div className="flex justify-between text-lg font-bold text-white">
                            <span>Total</span>
                            <span>{formatCurrency(subtotalZAR, 'ZAR')}</span>
                        </div>
                    </div>
                </div>

                {/* Shipping & Payment */}
                <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Shipping & Payment</h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                            <input type="text" id="name" name="name" required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-300">Street Address</label>
                            <input type="text" id="address" name="address" required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-300">City</label>
                                <input type="text" id="city" name="city" required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                            </div>
                             <div>
                                <label htmlFor="zip" className="block text-sm font-medium text-gray-300">Postal Code</label>
                                <input type="text" id="zip" name="zip" required className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                            </div>
                        </div>
                         <div className="border-t border-gray-700 pt-6 mt-2">
                             <h3 className="text-lg font-medium text-white mb-4">Payment Details</h3>
                             <div>
                                <label htmlFor="card-number" className="block text-sm font-medium text-gray-300">Card Number</label>
                                <input type="text" id="card-number" placeholder="**** **** **** ****" className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="expiry" className="block text-sm font-medium text-gray-300">Expiry</label>
                                    <input type="text" id="expiry" placeholder="MM / YY" className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                                </div>
                                <div>
                                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-300">CVC</label>
                                    <input type="text" id="cvc" placeholder="123" className="mt-1 w-full bg-gray-800 rounded-md border-gray-700 focus:ring-brand-green focus:border-brand-green" />
                                </div>
                            </div>
                         </div>
                    </div>
                    <div className="mt-8">
                        <button type="submit" disabled={isProcessing} className="w-full bg-brand-green text-brand-dark py-3 rounded-lg font-bold text-lg hover:brightness-90 transition-all disabled:opacity-50 disabled:cursor-wait">
                            {isProcessing ? 'Processing Payment...' : `Pay ${formatCurrency(subtotalZAR, 'ZAR')}`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
