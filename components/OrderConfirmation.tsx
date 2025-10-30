
import React from 'react';
import { Order } from '../types';
import { formatCurrency, calculateFinalPrice } from '../utils/pricing';

interface OrderConfirmationProps {
    order: Order;
    onContinue: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onContinue }) => {
    return (
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-center">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h1 className="text-3xl font-extrabold text-brand-green">Thank You!</h1>
                <p className="mt-2 text-lg text-white">Your order has been placed successfully.</p>
                <p className="mt-2 text-gray-400">Order ID: <span className="font-mono text-brand-green">{order.id}</span></p>
                
                <div className="text-left my-8">
                    <h2 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Order Summary</h2>
                    <div className="space-y-4">
                        {order.items.map(item => (
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
                            <span>{formatCurrency(order.totalZAR, 'ZAR')}</span>
                        </div>
                    </div>
                </div>

                <div className="text-left bg-gray-800/50 p-4 rounded-md">
                     <h3 className="font-semibold text-white">Shipping to:</h3>
                     <p className="text-gray-300">{order.shippingAddress.name}</p>
                     <p className="text-gray-300">{order.shippingAddress.address}</p>
                     <p className="text-gray-300">{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                </div>

                <button 
                    onClick={onContinue}
                    className="mt-8 w-full bg-brand-green text-brand-dark py-3 rounded-lg font-bold text-lg hover:brightness-90 transition-all"
                >
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};
