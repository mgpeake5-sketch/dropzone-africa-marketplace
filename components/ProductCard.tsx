
import React from 'react';
import { Product } from '../types';
import { calculateFinalPrice, formatCurrency } from '../utils/pricing';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { finalZAR } = calculateFinalPrice(product.priceUSD);

  return (
    <div 
      className="group cursor-pointer bg-gray-900 rounded-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-brand-green/20"
      onClick={() => onSelect(product)}
    >
      <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-brand-dark/50 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-300 truncate">{product.brand}</h3>
        <p className="mt-1 text-lg font-bold text-white truncate group-hover:text-brand-green transition-colors">{product.title}</p>
        <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-400">Size: {product.size}</p>
            <p className="text-lg font-semibold text-brand-green">{formatCurrency(finalZAR, 'ZAR')}</p>
        </div>
         <p className="text-xs text-gray-500 mt-1">Price includes duties & tax</p>
      </div>
    </div>
  );
};