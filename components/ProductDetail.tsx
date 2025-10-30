
import React, { useState } from 'react';
import { Product } from '../types';
import { calculateFinalPrice, formatCurrency } from '../utils/pricing';
import { Icon } from './icons';
import { getStyleSuggestion } from '../services/geminiService';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [styleSuggestion, setStyleSuggestion] = useState('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const { finalUSD, finalZAR } = calculateFinalPrice(product.priceUSD);

  const handleGetStyleSuggestion = async () => {
    setIsLoadingSuggestion(true);
    const suggestion = await getStyleSuggestion(product.title);
    setStyleSuggestion(suggestion);
    setIsLoadingSuggestion(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <button onClick={onBack} className="mb-6 text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center">
            &larr; Back to all sneakers
        </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div>
          <div className="aspect-w-1 aspect-h-1 w-full bg-gray-900 rounded-lg overflow-hidden mb-4">
            <img src={selectedImage} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`cursor-pointer rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-brand-green' : 'border-transparent'}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`${product.title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-sm font-semibold tracking-widest text-gray-400 uppercase">{product.brand}</h2>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-1">{product.title}</h1>
          
          <div className="mt-4">
            <p className="text-3xl font-bold text-brand-green">{formatCurrency(finalZAR, 'ZAR')}</p>
            <p className="text-sm text-gray-400">
              {formatCurrency(finalUSD, 'USD')} (incl. platform fee, import duty & tax)
            </p>
          </div>

          <div className="mt-6 border-t border-gray-800 pt-6">
            <h3 className="text-lg font-medium text-white">Details</h3>
            <div className="mt-4 space-y-2 text-gray-300">
                <p><span className="font-semibold">Condition:</span> {product.condition}</p>
                <p><span className="font-semibold">Size:</span> US {product.size}</p>
                <p><span className="font-semibold">SKU:</span> DZ-A-{product.id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          
          <p className="mt-6 text-gray-400 leading-relaxed">{product.description}</p>
          
          <div className="mt-8">
            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-brand-green text-brand-dark py-4 rounded-lg font-bold text-lg hover:brightness-90 transition-all transform hover:scale-105"
            >
              Add to Cart
            </button>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-6">
            <button 
                onClick={handleGetStyleSuggestion} 
                disabled={isLoadingSuggestion}
                className="w-full flex items-center justify-center space-x-2 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Icon name="sparkles" className="h-5 w-5 text-brand-green"/>
              <span>{isLoadingSuggestion ? 'Generating...' : 'Get AI Style Suggestion'}</span>
            </button>
            {styleSuggestion && !isLoadingSuggestion && (
              <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700 animate-fade-in">
                <p className="text-gray-300">{styleSuggestion}</p>
              </div>
            )}
             {isLoadingSuggestion && (
                <div className="mt-4 text-center text-gray-400">
                    <p>Our AI stylist is crafting the perfect look...</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
