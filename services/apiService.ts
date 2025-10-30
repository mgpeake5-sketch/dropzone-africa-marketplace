import { mockUsers } from '../data/mockData';
import { Product, User, UserRole, Order, CartItem, ProductStatus } from '../types';
import { calculateFinalPrice } from '../utils/pricing';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.dropzone-africa.com/api'  // Your production backend URL
  : 'http://localhost:8080/api';

export const apiService = {
  // Health check to test backend connection
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const health = await response.json();
      console.log('🏥 Backend Health:', health);
      return health;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      return { status: 'error', error: error.message };
    }
  },
  fetchProducts: async (): Promise<Product[]> => {
    console.log("API Service: Fetching products from backend...");
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      // Handle new response format with fallback info
      if (result.source === 'fallback') {
        console.log('ℹ️ Using fallback data:', result.message);
      } else if (result.source === 'database') {
        console.log('✅ Using database data, count:', result.count);
      }
      
      return result.data || result; // Handle both old and new formats
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  login: async (role: UserRole): Promise<User | undefined> => {
    console.log(`API Service: Login for role ${role}...`);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      // Handle new response format
      if (result.source === 'fallback') {
        console.log('ℹ️ Using fallback authentication:', result.message);
      } else if (result.source === 'database') {
        console.log('✅ Database authentication successful');
      }
      
      return result.data || result; // Handle both old and new formats
    } catch (error) {
      console.error('Error during login:', error);
      // Fallback to mock data for now
      const user = mockUsers.find(u => u.role === role);
      return user;
    }
  },

  fetchAllUsers: async (): Promise<User[]> => {
    console.log("API Service: Fetching all users from backend...");
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to mock data for now
      return [...mockUsers];
    }
  },
  
  addProduct: async (productData: Omit<Product, 'id' | 'createdAt' | 'sellerId' | 'status' | 'images'>): Promise<Product> => {
    console.log("API Service: Adding new product via backend...");
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newProduct = await response.json();
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      // Fallback to creating mock product
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...productData,
        images: [`https://picsum.photos/seed/${Date.now()}/800/600`],
        sellerId: 'user-2',
        createdAt: new Date().toISOString(),
        status: ProductStatus.Active,
      };
      return newProduct;
    }
  },

  placeOrder: async (items: CartItem[], shippingAddress: Order['shippingAddress']): Promise<Order> => {
    console.log("API Service: Placing order via backend...");
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, shippingAddress }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newOrder = await response.json();
      return newOrder;
    } catch (error) {
      console.error('Error placing order:', error);
      // Fallback to creating mock order
      const totalUSD = items.reduce((acc, item) => {
        const { finalUSD } = calculateFinalPrice(item.priceUSD);
        return acc + (finalUSD * item.quantity);
      }, 0);

      const totalZAR = items.reduce((acc, item) => {
        const { finalZAR } = calculateFinalPrice(item.priceUSD);
        return acc + (finalZAR * item.quantity);
      }, 0);

      const newOrder: Order = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        items,
        totalUSD,
        totalZAR,
        shippingAddress,
        createdAt: new Date().toISOString(),
      };
      return newOrder;
    }
  }
};
