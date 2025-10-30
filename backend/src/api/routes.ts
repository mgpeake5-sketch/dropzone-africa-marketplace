
import { Router } from 'express';
import { supabase } from '../supabaseClient';

const router = Router();

// GET /api/products
router.get('/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// POST /api/products - Add new product
router.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      seller_id: 'user-2', // Default seller for now
      created_at: new Date().toISOString(),
      status: 'active',
      images: [`https://picsum.photos/seed/${Date.now()}/800/600`]
    };

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding product:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to add product', error: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// GET /api/users
router.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { role } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Error during login:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to login', error: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

// POST /api/orders
router.post('/orders', async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    
    // Calculate totals (this should match your frontend logic)
    const totalUSD = items.reduce((acc: number, item: any) => {
      // Simple calculation - you might want to import your pricing utils
      const finalPrice = item.priceUSD * 1.1; // Assuming 10% markup
      return acc + (finalPrice * item.quantity);
    }, 0);

    const totalZAR = totalUSD * 18.5; // Rough USD to ZAR conversion

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      items: JSON.stringify(items),
      total_usd: totalUSD,
      total_zar: totalZAR,
      shipping_address: JSON.stringify(shippingAddress),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Transform back to frontend format
    const responseOrder = {
      id: data.id,
      items,
      totalUSD: data.total_usd,
      totalZAR: data.total_zar,
      shippingAddress,
      createdAt: data.created_at,
    };

    res.status(201).json(responseOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    if (error instanceof Error) {
        res.status(500).json({ message: 'Failed to place order', error: error.message });
    } else {
        res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
});

export default router;
