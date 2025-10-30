import React, { useState } from 'react';
import { Icon } from './icons';
import { User, UserRole } from '../types';
import { apiService } from '../services/apiService';

interface LoginProps {
    onLoginSuccess: (user: User) => void;
    onClose: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onClose }) => {
    const [loadingRole, setLoadingRole] = useState<UserRole | null>(null);
    
    const handleLogin = async (role: UserRole) => {
        setLoadingRole(role);
        try {
            const user = await apiService.login(role);
            if(user) {
                onLoginSuccess(user);
            } else {
                // Handle case where user is not found
                console.error(`Demo user for role ${role} not found.`);
            }
        } catch(error) {
            console.error("Login failed:", error);
        } finally {
            setLoadingRole(null);
        }
    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 max-w-sm w-full relative m-4">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <Icon name="x" className="h-6 w-6" />
                </button>
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2">
                        <span className="text-2xl font-bold tracking-tighter text-white">DROPZONE</span>
                        <span className="text-2xl font-bold tracking-tighter text-brand-green">AFRICA</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-4">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to continue</p>
                </div>
                
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-400">Email</label>
                        <input type="email" id="email" className="w-full bg-gray-800 border-gray-700 rounded-md mt-1 p-2 focus:ring-brand-green focus:border-brand-green" placeholder="you@example.com"/>
                    </div>
                    <div>
                        <label htmlFor="password-2" className="text-sm font-medium text-gray-400">Password</label>
                        <input type="password" id="password" className="w-full bg-gray-800 border-gray-700 rounded-md mt-1 p-2 focus:ring-brand-green focus:border-brand-green" placeholder="••••••••"/>
                    </div>
                    <button type="submit" className="w-full bg-brand-green text-brand-dark py-2.5 rounded-md font-semibold hover:brightness-90 transition-all">Sign In</button>
                </form>
                
                <div className="text-center text-sm text-gray-500 my-4">OR</div>

                <div className="space-y-3">
                     <button onClick={() => handleLogin(UserRole.Buyer)} disabled={!!loadingRole} className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-wait">
                        {loadingRole === UserRole.Buyer ? 'Logging in...' : 'Login as Buyer (Demo)'}
                    </button>
                     <button onClick={() => handleLogin(UserRole.Seller)} disabled={!!loadingRole} className="w-full bg-green-600 text-white py-2.5 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-wait">
                        {loadingRole === UserRole.Seller ? 'Logging in...' : 'Login as Seller (Demo)'}
                    </button>
                     <button onClick={() => handleLogin(UserRole.Admin)} disabled={!!loadingRole} className="w-full bg-purple-600 text-white py-2.5 rounded-md font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-wait">
                        {loadingRole === UserRole.Admin ? 'Logging in...' : 'Login as Admin (Demo)'}
                    </button>
                </div>
                
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p>AI-Powered ID Verification coming soon.</p>
                </div>
            </div>
        </div>
    );
};