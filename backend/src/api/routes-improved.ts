import { Router } from 'express';
import { supabase } from '../supabaseClient';
import { authUtils, authenticateToken, requireRole, rateLimit, AuthRequest } from '../middleware/auth';

const router = Router();

// Mock data as fallback
const mockProducts = [
  {
    id: 'prod-1',
    title: 'Air Jordan 13 Retro "Playoff"',
    description: 'The Air Jordan 13 Retro brings back the memorable "Playoff" colorway.',
    images: ['https://picsum.photos/seed/aj13retro/800/600'],
    category: 'Shoes',
    brand: 'Air Jordan',
    size: 10,
    condition: 'New with box',
    price_usd: 210,
    seller_id: 'user-2',
    created_at: '2023-10-26T10:00:00Z',
    status: 'Active'
  },
  {
    id: 'prod-2',
    title: 'Nike Air Force 1 Low "White"',
    description: 'The legend lives on. A modern take on the icon.',
    images: ['https://picsum.photos/seed/af1white/800/600'],
    category: 'Shoes',
    brand: 'Nike',
    size: 10.5,
    condition: 'New without box',
    price_usd: 100,
    seller_id: 'user-2',
    created_at: '2023-10-22T09:00:00Z',
    status: 'Active'
  }
];

const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    profile_photo: 'https://i.pravatar.cc/150?u=user-1',
    role: 'Buyer',
    location: 'Cape Town, South Africa',
    phone: '+27 12 345 6789',
    verified: true
  },
  {
    id: 'user-2',
    name: 'Sneaker Seller US',
    email: 'seller.us@example.com',
    profile_photo: 'https://i.pravatar.cc/150?u=user-2',
    role: 'Seller',
    location: 'Los Angeles, USA',
    phone: '+1 123 456 7890',
    verified: true
  },
  {
    id: 'user-3',
    name: 'Admin User',
    email: 'admin@dropzone.africa',
    profile_photo: 'https://i.pravatar.cc/150?u=user-3',
    role: 'Admin',
    location: 'Johannesburg, South Africa',
    phone: '+27 11 987 6543',
    verified: true
  }
];

// Helper function to test database connection
async function testDatabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('id')
      .limit(1);
    
    if (error && error.message.includes('relation') && error.message.includes('does not exist')) {
      return { connected: false, tablesExist: false, error: 'Tables not created' };
    }
    
    if (error) {
      return { connected: false, tablesExist: true, error: error.message };
    }
    
    return { connected: true, tablesExist: true, error: null };
  } catch (error) {
    return { connected: false, tablesExist: false, error: 'Connection failed' };
  }
}

// Health check endpoint
router.get('/health', async (req, res) => {
  const dbStatus = await testDatabaseConnection();
  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// GET /api/products
router.get('/products', async (req, res) => {
  try {
    console.log('🔍 Fetching products from database...');
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('⚠️ Database error, using fallback data:', error.message);
      return res.json({
        data: mockProducts,
        source: 'fallback',
        message: 'Using mock data - database not available'
      });
    }

    console.log('✅ Successfully fetched products from database');
    res.json({
      data: data || [],
      source: 'database',
      count: data?.length || 0
    });
    
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.json({
      data: mockProducts,
      source: 'fallback',
      message: 'Using mock data due to error'
    });
  }
});

// POST /api/products - Add new product (Seller or Admin only)
router.post('/products', authenticateToken, requireRole(['Seller', 'Admin']), async (req: AuthRequest, res) => {
  try {
    console.log('➕ Adding new product:', req.body);
    
    const productData = req.body;
    const newProduct = {
      title: productData.title,
      description: productData.description,
      category: productData.category,
      brand: productData.brand,
      size: parseFloat(productData.size),
      condition: productData.condition,
      price_usd: parseFloat(productData.priceUSD || productData.price_usd),
      seller_id: req.user?.id || 'user-2', // Use authenticated user ID
      status: 'Active',
      images: productData.images || [`https://picsum.photos/seed/${Date.now()}/800/600`]
    };

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.warn('⚠️ Database error adding product, creating mock response:', error.message);
      const mockNewProduct = {
        id: `prod-${Date.now()}`,
        ...newProduct,
        created_at: new Date().toISOString()
      };
      return res.status(201).json({
        data: mockNewProduct,
        source: 'fallback',
        message: 'Product created in mock system'
      });
    }

    console.log('✅ Product added to database successfully');
    res.status(201).json({
      data: data,
      source: 'database'
    });
    
  } catch (error) {
    console.error('❌ Error adding product:', error);
    const mockNewProduct = {
      id: `prod-${Date.now()}`,
      ...req.body,
      created_at: new Date().toISOString(),
      seller_id: 'user-2',
      status: 'Active'
    };
    res.status(201).json({
      data: mockNewProduct,
      source: 'fallback',
      message: 'Product created in mock system due to error'
    });
  }
});

// GET /api/profile - Get current user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    console.log('👤 Fetching profile for user:', req.user?.email);
    
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, location, phone, profile_photo, verified, created_at')
      .eq('id', req.user?.id)
      .single();

    if (error) {
      return res.status(404).json({
        error: 'Profile not found',
        message: 'Unable to fetch user profile'
      });
    }

    res.json({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        location: data.location,
        phone: data.phone,
        profilePhoto: data.profile_photo,
        verified: data.verified,
        createdAt: data.created_at
      },
      source: 'database'
    });
    
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({
      error: 'Profile fetch failed',
      message: 'Unable to fetch user profile'
    });
  }
});

// GET /api/users - Admin only
router.get('/users', authenticateToken, requireRole(['Admin']), async (req, res) => {
  try {
    console.log('👥 Fetching users from database...');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('⚠️ Database error, using fallback users:', error.message);
      return res.json({
        data: mockUsers,
        source: 'fallback',
        message: 'Using mock data - database not available'
      });
    }

    console.log('✅ Successfully fetched users from database');
    res.json({
      data: data || [],
      source: 'database',
      count: data?.length || 0
    });
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.json({
      data: mockUsers,
      source: 'fallback',
      message: 'Using mock data due to error'
    });
  }
});

// POST /api/register - New user registration
router.post('/register', rateLimit(10, 15 * 60 * 1000), async (req, res) => {
  try {
    console.log('📝 New user registration attempt...');
    
    const { name, email, password, role, location, phone } = req.body;
    
    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, password, and role are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash password
    const hashedPassword = await authUtils.hashPassword(password);
    
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      location: location || 'Not specified',
      phone: phone || 'Not specified',
      profile_photo: `https://i.pravatar.cc/150?u=${email}`,
      verified: false
    };

    const { data, error } = await supabase
      .from('users')
      .insert([newUser])
      .select('id, name, email, role, location, phone, profile_photo, verified, created_at')
      .single();

    if (error) {
      if (error.message.includes('duplicate key')) {
        return res.status(409).json({
          error: 'Email already exists',
          message: 'An account with this email already exists'
        });
      }
      
      console.warn('⚠️ Database error during registration:', error.message);
      return res.status(500).json({
        error: 'Registration failed',
        message: 'Unable to create account. Please try again.'
      });
    }

    // Generate token
    const token = authUtils.generateToken({
      id: data.id,
      email: data.email,
      role: data.role,
      name: data.name
    });

    console.log('✅ User registered successfully:', data.email);
    res.status(201).json({
      message: 'Registration successful',
      user: data,
      token,
      source: 'database'
    });
    
  } catch (error) {
    console.error('❌ Error during registration:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Internal server error during registration'
    });
  }
});

// POST /api/login
router.post('/login', rateLimit(10, 15 * 60 * 1000), async (req, res) => {
  try {
    console.log('🔐 User login attempt...');
    
    const { email, password, role } = req.body;
    
    // Support both email/password and role-based login
    if (email && password) {
      // Email/password login
      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing credentials',
          message: 'Email and password are required'
        });
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !data) {
        return res.status(401).json({
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Verify password (if user has password field)
      if (data.password) {
        const isPasswordValid = await authUtils.verifyPassword(password, data.password);
        if (!isPasswordValid) {
          return res.status(401).json({
            error: 'Invalid credentials',
            message: 'Email or password is incorrect'
          });
        }
      }

      // Generate token
      const token = authUtils.generateToken({
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name
      });

      console.log('✅ User authenticated successfully with email/password');
      return res.json({
        message: 'Login successful',
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          location: data.location,
          phone: data.phone,
          profilePhoto: data.profile_photo,
          verified: data.verified
        },
        token,
        source: 'database'
      });
      
    } else if (role) {
      // Role-based login (for demo/testing)
      console.log('🔐 Role-based login for:', role);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', role)
        .limit(1)
        .single();

      if (error) {
        console.warn('⚠️ Database error during role login, using fallback:', error.message);
        const fallbackUser = mockUsers.find(u => u.role === role);
        if (fallbackUser) {
          // Generate token for fallback user
          const token = authUtils.generateToken({
            id: fallbackUser.id,
            email: fallbackUser.email,
            role: fallbackUser.role,
            name: fallbackUser.name
          });
          
          return res.json({
            message: 'Login successful (fallback)',
            user: fallbackUser,
            token,
            source: 'fallback'
          });
        } else {
          return res.status(404).json({
            error: 'User not found',
            message: `No user found with role: ${role}`
          });
        }
      }

      // Generate token for database user
      const token = authUtils.generateToken({
        id: data.id,
        email: data.email,
        role: data.role,
        name: data.name
      });

      console.log('✅ User authenticated successfully with role');
      return res.json({
        message: 'Login successful',
        user: {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          location: data.location,
          phone: data.phone,
          profilePhoto: data.profile_photo,
          verified: data.verified
        },
        token,
        source: 'database'
      });
      
    } else {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Please provide either email/password or role for login'
      });
    }
    
  } catch (error) {
    console.error('❌ Error during login:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during login'
    });
  }
});

// POST /api/orders
router.post('/orders', async (req, res) => {
  try {
    console.log('📦 Processing new order...');
    
    const { items, shippingAddress } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Invalid order data',
        message: 'Order must contain at least one item'
      });
    }

    // Calculate totals
    const totalUSD = items.reduce((acc: number, item: any) => {
      const itemPrice = parseFloat(item.priceUSD || item.price_usd || 0);
      const quantity = parseInt(item.quantity || 1);
      return acc + (itemPrice * quantity);
    }, 0);

    const totalZAR = totalUSD * 18.5; // Rough USD to ZAR conversion

    const orderData = {
      items: JSON.stringify(items),
      total_usd: totalUSD,
      total_zar: totalZAR,
      shipping_address: JSON.stringify(shippingAddress)
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.warn('⚠️ Database error creating order, using fallback:', error.message);
      const mockOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        items,
        totalUSD,
        totalZAR,
        shippingAddress,
        createdAt: new Date().toISOString()
      };
      return res.status(201).json({
        data: mockOrder,
        source: 'fallback',
        message: 'Order created in mock system'
      });
    }

    console.log('✅ Order created successfully in database');
    
    // Transform response back to frontend format
    const responseOrder = {
      id: data.id,
      items,
      totalUSD: data.total_usd,
      totalZAR: data.total_zar,
      shippingAddress,
      createdAt: data.created_at
    };

    res.status(201).json({
      data: responseOrder,
      source: 'database'
    });
    
  } catch (error) {
    console.error('❌ Error creating order:', error);
    const mockOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      items: req.body.items,
      totalUSD: 0,
      totalZAR: 0,
      shippingAddress: req.body.shippingAddress,
      createdAt: new Date().toISOString()
    };
    res.status(201).json({
      data: mockOrder,
      source: 'fallback',
      message: 'Order created in mock system due to error'
    });
  }
});

export default router;