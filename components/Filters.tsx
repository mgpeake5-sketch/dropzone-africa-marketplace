
import React from 'react';
import { Icon } from './icons';

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  priceValue: number;
  onPriceChange: (price: number) => void;
  brands: string[];
  sizes: number[];
}

const MAX_PRICE = 15000;

export const Filters: React.FC<FiltersProps> = ({
  searchQuery, onSearchChange,
  selectedBrand, onBrandChange,
  selectedSize, onSizeChange,
  priceValue, onPriceChange,
  brands, sizes
}) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 sticky top-20">
      <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
      <div className="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-400">Search</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" className="h-5 w-5 text-gray-500" />
            </div>
            <input 
              type="text" 
              name="search" 
              id="search" 
              className="bg-gray-800 focus:ring-brand-green focus:border-brand-green block w-full pl-10 sm:text-sm border-gray-700 rounded-md py-2" 
              placeholder="e.g. Air Jordan 1" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>
        {/* Brand */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-400">Brand</label>
          <select 
            id="brand" 
            name="brand" 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-800 border-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md"
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
          </select>
        </div>
        {/* Size */}
        <div>
          <label htmlFor="size" className="block text-sm font-medium text-gray-400">Size (US)</label>
          <select 
            id="size" 
            name="size" 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-800 border-gray-700 focus:outline-none focus:ring-brand-green focus:border-brand-green sm:text-sm rounded-md"
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
          >
            <option value="">All Sizes</option>
            {sizes.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
        {/* Price Range */}
        <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-400">Max Price (ZAR)</label>
            <input 
              type="range" 
              id="price" 
              name="price" 
              min="0" 
              max={MAX_PRICE} 
              step="500" 
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2 accent-brand-green"
              value={priceValue}
              onChange={(e) => onPriceChange(Number(e.target.value))}
            />
             <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>R0</span>
                <span>R{priceValue.toLocaleString()}{priceValue === MAX_PRICE ? '+' : ''}</span>
            </div>
        </div>
      </div>
    </div>
  );
};
