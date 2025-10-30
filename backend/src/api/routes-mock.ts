import { Router } from 'express';

const router = Router();

// Mock data for testing
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
    priceUSD: 210,
    sellerId: 'user-2',
    createdAt: '2023-10-26T10:00:00Z',
    status: 'Active'
  }
];

const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePhoto: 'https://i.pravatar.cc/150?u=user-1',
    role: 'Buyer',
    location: 'Cape Town, South Africa',
    phone: '+27 12 345 6789',
    verified: true
  },
  {
    id: 'user-2',
    name: 'Sneaker Seller US',
    email: 'seller.us@example.com',
    profilePhoto: 'https://i.pravatar.cc/150?u=user-2',
    role: 'Seller',
    location: 'Los Angeles, USA',
    phone: '+1 123 456 7890',
    verified: true
  }
];

// GET /api/products
router.get('/products', (req, res) => {
  console.log('GET /api/products called');
  res.json(mockProducts);
});

// GET /api/users
router.get('/users', (req, res) => {
  console.log('GET /api/users called');
  res.json(mockUsers);
});

// POST /api/login
router.post('/login', (req, res) => {
  console.log('POST /api/login called with:', req.body);
  const { role } = req.body;
  const user = mockUsers.find(u => u.role === role);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// POST /api/products
router.post('/products', (req, res) => {
  console.log('POST /api/products called with:', req.body);
  const newProduct = {
    id: `prod-${Date.now()}`,
    ...req.body,
    sellerId: 'user-2',
    createdAt: new Date().toISOString(),
    status: 'Active',
    images: [`https://picsum.photos/seed/${Date.now()}/800/600`]
  };
  res.status(201).json(newProduct);
});

// POST /api/orders
router.post('/orders', (req, res) => {
  console.log('POST /api/orders called with:', req.body);
  const { items, shippingAddress } = req.body;
  
  const totalUSD = items.reduce((acc: number, item: any) => {
    return acc + (item.priceUSD * item.quantity);
  }, 0);

  const newOrder = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    items,
    totalUSD,
    totalZAR: totalUSD * 18.5,
    shippingAddress,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json(newOrder);
});

export default router;