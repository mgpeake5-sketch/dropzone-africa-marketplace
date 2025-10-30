
import React, { useState } from 'react';
import { Icon } from './icons';
import { User, UserRole, CartItem } from '../types';

interface HeaderProps {
  currentUser: User | null;
  cartCount: number;
  onLoginClick: () => void;
  onHomeClick: () => void;
  onCartClick: () => void;
  onDashboardClick: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, cartCount, onLoginClick, onHomeClick, onCartClick, onDashboardClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDashboardLink = (role: UserRole) => {
    onDashboardClick(role);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-brand-dark/80 backdrop-blur-lg border-b border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onHomeClick}>
            <span className="text-2xl font-bold tracking-tighter text-white">DROPZONE</span>
            <span className="text-2xl font-bold tracking-tighter text-brand-green">AFRICA</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">New Releases</a>
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Brands</a>
            <a href="#" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Sale</a>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <Icon name="search" className="h-5 w-5" />
            </button>
             <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <Icon name="heart" className="h-5 w-5" />
            </button>
            <button onClick={onCartClick} className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
              <Icon name="cart" className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-brand-dark">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="border-l border-gray-700 h-6 mx-2"></div>
            {currentUser ? (
              <div className="relative">
                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center space-x-2">
                  <img src={currentUser.profilePhoto} alt={currentUser.name} className="h-8 w-8 rounded-full" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg py-1 animate-fade-in">
                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                        <p className="font-semibold">{currentUser.name}</p>
                        <p className="text-xs text-gray-500">{currentUser.role}</p>
                    </div>
                    {currentUser.role === UserRole.Seller && (
                        <a href="#" onClick={(e) => { e.preventDefault(); handleDashboardLink(UserRole.Seller); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">Seller Dashboard</a>
                    )}
                    {currentUser.role === UserRole.Admin && (
                        <a href="#" onClick={(e) => { e.preventDefault(); handleDashboardLink(UserRole.Admin); }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">Admin Dashboard</a>
                    )}
                    <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">Logout</a>
                  </div>
                )}
              </div>
            ) : (
                <button onClick={onLoginClick} className="hidden md:inline-block bg-brand-green text-brand-dark px-4 py-2 rounded-md text-sm font-semibold hover:brightness-90 transition-all">
                    Login
                </button>
            )}
            <button className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800">
                 <Icon name="user" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
