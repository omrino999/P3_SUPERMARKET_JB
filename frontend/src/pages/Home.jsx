import React, { useState, useEffect, useRef } from 'react';
import { productApi, cartApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Search, Check } from 'lucide-react';

const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState({});
  const [addedToasts, setAddedToasts] = useState([]);
  const addedToastTimeoutsRef = useRef([]);
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const shopSectionRef = useRef(null);

  const scrollToShop = () => {
    shopSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [deptsRes, productsRes] = await Promise.all([
        productApi.getDepartments(),
        productApi.getProducts()
      ]);
      setDepartments(deptsRes.data);
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeptSelect = async (deptId) => {
    // Toggle: clicking same department again shows all products
    const newDeptId = selectedDept === deptId ? null : deptId;
    
    // Capture scroll position RIGHT NOW (before any state changes)
    const currentScrollY = window.scrollY;
    
    setSelectedDept(newDeptId);
    setSearchTerm('');
    
    try {
      // FIX: Removed the "if (products.length === 0) setLoading(true)" 
      // This was causing flicker when switching away from empty departments (Frozen Foods)
      
      const res = await productApi.getProducts(newDeptId);
      setProducts(res.data);
      
      // After products update, restore scroll position if page is tall enough
      requestAnimationFrame(() => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const targetScroll = Math.min(currentScrollY, Math.max(0, maxScroll));
        window.scrollTo(0, targetScroll);
      });
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    setCartLoading(prev => ({ ...prev, [productId]: true }));
    try {
      await cartApi.addToCart(productId, 1);
      refreshCartCount();
      // One toast per add – multiple toasts can stack
      const id = Date.now();
      setAddedToasts(prev => [...prev, id]);
      const timeoutId = setTimeout(() => {
        setAddedToasts(prev => prev.filter(t => t !== id));
      }, 2500);
      addedToastTimeoutsRef.current.push(timeoutId);
    } catch (err) {
      console.error('Failed to add to cart', err);
    } finally {
      setCartLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  useEffect(() => {
    return () => {
      addedToastTimeoutsRef.current.forEach(clearTimeout);
      addedToastTimeoutsRef.current = [];
    };
  }, []);

  if (loading && products.length === 0) {
    return <div className="text-center py-20 text-gray-500 font-medium">Loading your supermarket...</div>;
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="bg-green-600 rounded-3xl p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-6 max-w-xl relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Fresh Groceries <br /> 
            <span className="text-green-200">Delivered Fast.</span>
          </h1>
          <p className="text-lg text-green-50 opacity-90">
            Shop the best quality fruits, vegetables, dairy, and meats from the comfort of your home.
          </p>
          <button 
            onClick={scrollToShop}
            className="bg-white text-green-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-green-50 transition-all"
          >
            Start Shopping
          </button>
        </div>
        <div className="text-[120px] md:text-[180px] select-none animate-bounce relative z-10">
          🍎
        </div>
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-20 -mt-20 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-700 rounded-full -ml-10 -mb-10 opacity-50 blur-2xl"></div>
      </section>

      {/* Departments Section */}
      <section ref={shopSectionRef} className="scroll-mt-24">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Shop by Department</h2>
            <p className="text-gray-500 dark:text-gray-400">Explore our wide selection of categories</p>
          </div>
          <button 
            onClick={() => handleDeptSelect(null)}
            disabled={!selectedDept}
            className={`text-sm font-bold px-4 py-2 rounded-lg transition-all ${selectedDept ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50' : 'text-gray-400 dark:text-gray-500 cursor-default'}`}
          >
            {selectedDept ? 'Show All' : 'Showing All'}
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => handleDeptSelect(dept.id)}
              className={`flex-shrink-0 group px-6 py-4 rounded-2xl border-2 transition-all text-left min-w-[140px] ${
                selectedDept === dept.id 
                ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100 dark:shadow-green-900/30' 
                : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-700 dark:text-gray-200'
              }`}
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {dept.name === 'Dairy' ? '🥛' : 
                 dept.name === 'Meats' ? '🥩' : 
                 dept.name === 'Fruits & Vegs' ? '🥗' : 
                 dept.name === 'Bakery' ? '🥐' : 
                 dept.name === 'Frozen Foods' ? '🧊' : '📦'}
              </div>
              <h3 className="font-bold whitespace-nowrap">{dept.name}</h3>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            {selectedDept ? departments.find(d => d.id === selectedDept)?.name : 'All Products'}
          </h2>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-green-500">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none bg-transparent text-sm w-40 md:w-64 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-green-100 dark:hover:border-green-900 transition-all flex flex-col">
                <div className="aspect-square relative overflow-hidden bg-gray-50 dark:bg-gray-900">
                  <img 
                    src={product.image_url || 'https://placehold.co/400x400?text=Product'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!user && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 rounded-lg shadow-sm">
                        <ShoppingCart size={16} className="text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-md">
                      {departments.find(d => d.id === product.department_id)?.name}
                    </span>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 mt-2 line-clamp-2 leading-tight h-10">{product.name}</h3>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      disabled={cartLoading[product.id]}
                      className={`p-3 rounded-xl transition-all ${
                        cartLoading[product.id] 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' 
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100 dark:shadow-none hover:shadow-green-200'
                      }`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try searching for something else or selecting a different department</p>
          </div>
        )}
      </section>

      {/* Added to cart toasts – one per add, stack upward */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col-reverse gap-2 pointer-events-none">
        {addedToasts.map((id) => (
          <div
            key={id}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-100 pointer-events-auto"
            role="status"
            aria-live="polite"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Check size={18} className="text-green-600 dark:text-green-400" strokeWidth={2.5} />
            </div>
            <span className="font-medium text-sm">Added to cart</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;