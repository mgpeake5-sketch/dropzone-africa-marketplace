
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { Filters } from './components/Filters';
import { Login } from './components/Login';
import { Cart } from './components/Cart';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { Toast } from './components/Toast';
import { SkeletonCard } from './components/SkeletonCard';
import { LoadingSpinner, LoadingCard, LoadingOverlay } from './components/LoadingComponents';
import { ErrorDisplay, EmptyState, useAsyncOperation } from './components/ErrorHandling';
import { apiService } from './services/apiService';
import { Product, User, UserRole, CartItem, Order, ToastMessage } from './types';
import { calculateFinalPrice } from './utils/pricing';

type View = 'home' | 'productDetail' | 'login' | 'sellerDashboard' | 'adminDashboard' | 'checkout' | 'orderConfirmation';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Use the new async operation hook
  const { execute, isLoading, error, clearError } = useAsyncOperation();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [priceValue, setPriceValue] = useState(15000);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
      const result = await execute(
        () => apiService.fetchProducts(),
        {
          loadingMessage: 'Loading products...',
          onSuccess: (fetchedProducts) => {
            setProducts(fetchedProducts);
            showToast('Products loaded successfully!');
          },
          onError: (error) => {
            console.error("Failed to fetch products:", error);
            showToast('Failed to load products.', 'error');
          }
        }
      );
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const newToast: ToastMessage = { id: Date.now(), message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 3000);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setView('productDetail');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setView('home');
  };
  
  const handleLoginSuccess = (user: User) => {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setView('home');
      showToast(`Welcome back, ${user.name}!`);
  }

  const handleDashboardClick = (role: UserRole) => {
      if (role === UserRole.Seller) setView('sellerDashboard');
      if (role === UserRole.Admin) setView('adminDashboard');
  }

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const itemInCart = prevItems.find(item => item.id === product.id);
      if (itemInCart) {
        return prevItems.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    showToast(`${product.title} added to cart.`);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const handlePlaceOrder = async (shippingAddress: Order['shippingAddress']) => {
    if (!currentUser) {
        showToast('You must be logged in to place an order.', 'error');
        setView('login');
        return;
    }
    
    const result = await execute(
      () => apiService.placeOrder(cartItems, shippingAddress),
      {
        loadingMessage: 'Processing your order...',
        onSuccess: (order) => {
          setPlacedOrder(order);
          setCartItems([]);
          setView('orderConfirmation');
          setIsCartOpen(false);
          showToast('Order placed successfully!');
        },
        onError: (error) => {
          console.error('Order placement failed:', error);
          showToast('There was an error placing your order.', 'error');
        }
      }
    );
  };

  const handleProductAdded = (newProduct: Product) => {
      setProducts(prev => [newProduct, ...prev]);
      showToast('New product listed successfully!');
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { uniqueBrands, uniqueSizes, filteredProducts } = useMemo(() => {
    const brands = [...new Set(products.map(p => p.brand))];
    // FIX: Explicitly typed the sort function arguments to resolve the arithmetic operation error.
    const sizes = [...new Set(products.map(p => p.size))].sort((a: number, b: number) => a - b);

    const filtered = products.filter(product => {
        const { finalZAR } = calculateFinalPrice(product.priceUSD);
        return (
            product.status === 'Active' &&
            (searchQuery === '' || product.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedBrand === '' || product.brand === selectedBrand) &&
            (selectedSize === '' || product.size === Number(selectedSize)) &&
            (finalZAR <= priceValue)
        );
    });

    return { uniqueBrands: brands, uniqueSizes: sizes, filteredProducts: filtered };
  }, [products, searchQuery, selectedBrand, selectedSize, priceValue]);


  const renderView = () => {
    switch (view) {
      case 'productDetail':
        return selectedProduct && <ProductDetail product={selectedProduct} onBack={handleBackToHome} onAddToCart={handleAddToCart} />;
      case 'sellerDashboard':
        return <SellerDashboard onProductAdded={handleProductAdded} />;
      case 'adminDashboard':
        return <AdminDashboard onBack={handleBackToHome} />;
      case 'checkout':
        return <Checkout items={cartItems} onPlaceOrder={handlePlaceOrder} onBack={() => setIsCartOpen(true)} />;
      case 'orderConfirmation':
        return placedOrder && <OrderConfirmation order={placedOrder} onContinue={handleBackToHome} />;
      case 'home':
      default:
        return (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Latest Drops</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">Authentic sneakers from the US, delivered to your door in South Africa.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="hidden lg:block lg:col-span-1">
                <Filters 
                    searchQuery={searchQuery} onSearchChange={setSearchQuery}
                    selectedBrand={selectedBrand} onBrandChange={setSelectedBrand}
                    selectedSize={selectedSize} onSizeChange={setSelectedSize}
                    priceValue={priceValue} onPriceChange={setPriceValue}
                    brands={uniqueBrands} sizes={uniqueSizes}
                />
              </div>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {error && (
                    <div className="col-span-full">
                      <ErrorDisplay
                        error={error}
                        message="Failed to load products"
                        onRetry={fetchProducts}
                        onDismiss={clearError}
                      />
                    </div>
                  )}
                  
                  {isLoading ? (
                    <LoadingCard count={6} className="col-span-1" />
                  ) : filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onSelect={handleProductSelect} />
                    ))
                  ) : !error ? (
                    <div className="col-span-full">
                      <EmptyState
                        icon="👟"
                        title="No sneakers found"
                        description="No sneakers match your current criteria. Try adjusting your filters."
                        action={{
                          label: "Clear Filters",
                          onClick: () => {
                            // Reset filters - you'd need to implement this
                            fetchProducts();
                          }
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark font-sans">
      <LoadingOverlay isVisible={isLoading} message="Loading..." />
      <Toast toasts={toasts} />
      <Header 
        currentUser={currentUser}
        cartCount={cartItemCount}
        onLoginClick={() => setView('login')}
        onHomeClick={handleBackToHome}
        onCartClick={() => setIsCartOpen(true)}
        onDashboardClick={handleDashboardClick}
      />
      <main>
        {renderView()}
      </main>
      <Cart 
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onCheckout={() => {
            setIsCartOpen(false);
            setView('checkout');
        }}
      />
      {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} onClose={handleBackToHome} />}
      <footer className="bg-gray-900 border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
          {/* FIX: Replaced invalid function call `newgetFullYear()` with `new Date().getFullYear()` to correctly display the current year. */}
          &copy; {new Date().getFullYear()} DROPZONE AFRICA. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
