
import React, { Fragment } from 'react';
import { CartItem } from '../types';
import { Icon } from './icons';
import { calculateFinalPrice, formatCurrency } from '../utils/pricing';

interface CartProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCheckout: () => void;
}

export const Cart: React.FC<CartProps> = ({ isOpen, items, onClose, onRemoveItem, onUpdateQuantity, onCheckout }) => {
  const subtotal = items.reduce((acc, item) => {
    const { finalUSD } = calculateFinalPrice(item.priceUSD);
    return acc + (finalUSD * item.quantity);
  }, 0);

  const subtotalZAR = items.reduce((acc, item) => {
    const { finalZAR } = calculateFinalPrice(item.priceUSD);
    return acc + (finalZAR * item.quantity);
  }, 0);

  return (
    <div 
        className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        aria-labelledby="slide-over-title" 
        role="dialog" 
        aria-modal="true"
    >
        <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose}></div>
        
        <div className={`absolute inset-y-0 right-0 flex max-w-full pl-10 transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-brand-dark shadow-xl border-l border-gray-800">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                            <h2 className="text-lg font-medium text-white" id="slide-over-title">Shopping Cart</h2>
                            <div className="ml-3 flex h-7 items-center">
                                <button type="button" className="-m-2 p-2 text-gray-400 hover:text-white" onClick={onClose}>
                                    <span className="sr-only">Close panel</span>
                                    <Icon name="x" className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="flow-root">
                                <ul role="list" className="-my-6 divide-y divide-gray-700">
                                    {items.length === 0 ? (
                                        <li className="flex py-6">
                                            <p className="text-gray-400">Your cart is empty.</p>
                                        </li>
                                    ) : (
                                        items.map((item) => (
                                            <li key={item.id} className="flex py-6">
                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-700">
                                                    <img src={item.images[0]} alt={item.title} className="h-full w-full object-cover object-center" />
                                                </div>
                                                <div className="ml-4 flex flex-1 flex-col">
                                                    <div>
                                                        <div className="flex justify-between text-base font-medium text-white">
                                                            <h3><a href="#">{item.title}</a></h3>
                                                            <p className="ml-4">{formatCurrency(calculateFinalPrice(item.priceUSD).finalZAR, 'ZAR')}</p>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-400">Size: {item.size}</p>
                                                    </div>
                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                        <div className="flex items-center border border-gray-700 rounded-md">
                                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-400 hover:text-white">-</button>
                                                            <p className="w-8 text-center text-white">{item.quantity}</p>
                                                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-400 hover:text-white">+</button>
                                                        </div>
                                                        <div className="flex">
                                                            <button type="button" onClick={() => onRemoveItem(item.id)} className="font-medium text-red-500 hover:text-red-400">
                                                                <Icon name="trash" className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {items.length > 0 && (
                        <div className="border-t border-gray-700 py-6 px-4 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-white">
                                <p>Subtotal</p>
                                <p>{formatCurrency(subtotalZAR, 'ZAR')}</p>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-400">Shipping and taxes calculated at checkout.</p>
                            <div className="mt-6">
                                <button onClick={onCheckout} className="w-full flex items-center justify-center rounded-md border border-transparent bg-brand-green px-6 py-3 text-base font-medium text-brand-dark shadow-sm hover:brightness-90">Checkout</button>
                            </div>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                <p>
                                    or <button type="button" className="font-medium text-brand-green hover:brightness-90" onClick={onClose}>Continue Shopping<span aria-hidden="true"> &rarr;</span></button>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};
