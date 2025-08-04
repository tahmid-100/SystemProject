import React, { useRef, useState, useEffect } from "react";
import { 
  Box, Button, Container, Grid, Typography, 
  Card, CardContent, CardMedia, Fab, CircularProgress,
  Snackbar, Alert
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router-dom';

export const Shop = () => {
  const navigate = useNavigate();

  // Refs for each section
  const sectionRefs = {
    power: useRef(null),
    sleep: useRef(null),
    security: useRef(null),
    bags: useRef(null),
    rain: useRef(null)
  };
  
  // State for active category
  const [activeCategory, setActiveCategory] = useState('power');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // State for products
  const [powerProducts, setPowerProducts] = useState([]);
  const [sleepProducts, setSleepProducts] = useState([]);
  const [securityProducts, setSecurityProducts] = useState([]);
  const [rainProducts, setRainProducts] = useState([]);
  const [bagProducts, setBagProducts] = useState([]);
  const [powerLoading, setPowerLoading] = useState(true);
  const [sleepLoading, setSleepLoading] = useState(true);
  const [securityLoading, setSecurityLoading] = useState(true);
  const [rainLoading, setRainLoading] = useState(true);
  const [bagLoading, setBagLoading] = useState(true);
  const [powerError, setPowerError] = useState(null);
  const [sleepError, setSleepError] = useState(null);
  const [securityError, setSecurityError] = useState(null);
  const [rainError, setRainError] = useState(null);
  const [bagError, setBagError] = useState(null);
  
  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showCart, setShowCart] = useState(false);
  
  // Notification state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Fix body overflow issue on mount
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100vh';
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  // Load cart count on component mount
  useEffect(() => {
    loadCartCount();
  }, []);

  // Load cart count from backend
  const loadCartCount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001' 
        : '';
      
      const response = await fetch(`${baseUrl}/api/cart/${userId}`);
      
      if (response.ok) {
        const cartData = await response.json();
        setCartCount(cartData.totalItems);
        setShowCart(cartData.totalItems > 0);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch power products on component mount
  useEffect(() => {
    const fetchPowerProducts = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3001' 
          : '';
        
        const response = await fetch(`${baseUrl}/api/products/power`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch power products');
        }
        
        const data = await response.json();
        setPowerProducts(data);
      } catch (err) {
        setPowerError(err.message);
      } finally {
        setPowerLoading(false);
      }
    };
    
    fetchPowerProducts();
  }, []);

  // Fetch sleep products on component mount
  useEffect(() => {
    const fetchSleepProducts = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3001' 
          : '';
        
        const response = await fetch(`${baseUrl}/api/products/sleep`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch sleep products');
        }
        
        const data = await response.json();
        setSleepProducts(data);
      } catch (err) {
        setSleepError(err.message);
      } finally {
        setSleepLoading(false);
      }
    };
    
    fetchSleepProducts();
  }, []);

  // Fetch security products on component mount
  useEffect(() => {
    const fetchSecurityProducts = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3001' 
          : '';
        
        const response = await fetch(`${baseUrl}/api/products/security`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch security products');
        }
        
        const data = await response.json();
        setSecurityProducts(data);
      } catch (err) {
        setSecurityError(err.message);
      } finally {
        setSecurityLoading(false);
      }
    };
    
    fetchSecurityProducts();
  }, []);

  // Fetch rain products on component mount
  useEffect(() => {
    const fetchRainProducts = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3001' 
          : '';
        
        const response = await fetch(`${baseUrl}/api/products/rain`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch rain products');
        }
        
        const data = await response.json();
        setRainProducts(data);
      } catch (err) {
        setRainError(err.message);
      } finally {
        setRainLoading(false);
      }
    };
    
    fetchRainProducts();
  }, []);

  // Fetch bags products on component mount
  useEffect(() => {
    const fetchBagProducts = async () => {
      try {
        const baseUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:3001' 
          : '';
        
        const response = await fetch(`${baseUrl}/api/products/bags`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch bag products');
        }
        
        const data = await response.json();
        setBagProducts(data);
      } catch (err) {
        setBagError(err.message);
      } finally {
        setBagLoading(false);
      }
    };
    
    fetchBagProducts();
  }, []);

  // Scroll to section function
  const scrollToSection = (category) => {
    setActiveCategory(category);
    const element = sectionRefs[category].current;
    if (element) {
      const headerOffset = 130;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Add to cart function
  const handleAddToCart = async (product) => {
    try {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setSnackbar({
          open: true,
          message: 'Please login to add items to cart',
          severity: 'warning'
        });
        return;
      }

      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001' 
        : '';

      const response = await fetch(`${baseUrl}/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          product
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update cart count
        setCartCount(prevCount => prevCount + 1);
        setShowCart(true);
        
        // Show success message
        setSnackbar({
          open: true,
          message: `${product.name} added to cart!`,
          severity: 'success'
        });
        
        // Reload cart count to get accurate count
        loadCartCount();
      } else {
        throw new Error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add item to cart',
        severity: 'error'
      });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ fontWeight: 'bold' }}
          >
            Travel Gear Marketplace
          </Typography>
          <Typography variant="h5" component="p">
            Premium accessories for your adventures
          </Typography>
        </Container>
      </Box>

      {/* Category Navigation */}
      <Box 
        sx={{
          position: 'sticky',
          top: 64,
          bgcolor: 'white',
          zIndex: 1000,
          boxShadow: 2,
          py: 2
        }}
      >
        <Container>
          <Grid container justifyContent="center" spacing={2}>
            {[
              { id: 'power', label: 'Power' },
              { id: 'sleep', label: 'Sleep & Comfort' },
              { id: 'security', label: 'Security' },
              { id: 'bags', label: 'Bags & Luggage' },
              { id: 'rain', label: 'Rain Protection' }
            ].map((category) => (
              <Grid item key={category.id}>
                <Button
                  variant={activeCategory === category.id ? "contained" : "outlined"}
                  color="primary"
                  onClick={() => scrollToSection(category.id)}
                  sx={{ 
                    fontWeight: 'bold',
                    borderRadius: '25px',
                    px: 3,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {category.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Cart FAB */}
      {showCart && (
        <Box
          sx={{
            position: 'fixed',
            top: '100px',
            right: '20px',
            zIndex: 1100,
          }}
        >
          <Fab
            color="primary"
            aria-label="shopping cart"
            onClick={() => navigate('/cart')}
            sx={{
              width: 60,
              height: 60,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </Fab>
        </Box>
      )}

      {/* Products Sections */}
      <Container sx={{ py: 6 }}>
        {/* Power Section */}
        <Box ref={sectionRefs.power} sx={{ mb: 10 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              mb: 4,
              borderBottom: '3px solid',
              borderColor: 'primary.main',
              pb: 1,
              display: 'inline-block'
            }}
          >
            Power Accessories
          </Typography>

          {powerLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : powerError ? (
            <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
              Error loading power products: {powerError}
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {powerProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.product_name,
                      price: `$${product.price}`,
                      image: product.img_url,
                      description: product.description
                    }} 
                    onAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Sleep & Comfort Section */}
        <Box ref={sectionRefs.sleep} sx={{ mb: 10 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              mb: 4,
              borderBottom: '3px solid',
              borderColor: 'primary.main',
              pb: 1,
              display: 'inline-block'
            }}
          >
            Sleep & Comfort
          </Typography>
          
          {sleepLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : sleepError ? (
            <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
              Error loading sleep products: {sleepError}
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {sleepProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.product_name,
                      price: `$${product.price}`,
                      image: product.img_url,
                      description: product.description
                    }} 
                    onAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Security Section */}
        <Box ref={sectionRefs.security} sx={{ mb: 10 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              mb: 4,
              borderBottom: '3px solid',
              borderColor: 'primary.main',
              pb: 1,
              display: 'inline-block'
            }}
          >
            Travel Security
          </Typography>
          {securityLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : securityError ? (
            <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
              Error loading security products: {securityError}
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {securityProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.product_name,
                      price: `$${product.price}`,
                      image: product.img_url,
                      description: product.description
                    }} 
                    onAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Bags Section */}
        <Box ref={sectionRefs.bags} sx={{ mb: 10 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              mb: 4,
              borderBottom: '3px solid',
              borderColor: 'primary.main',
              pb: 1,
              display: 'inline-block'
            }}
          >
            Bags & Luggage
          </Typography>
          {bagLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : bagError ? (
            <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
              Error loading bag products: {bagError}
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {bagProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.product_name,
                      price: `$${product.price}`,
                      image: product.img_url,
                      description: product.description
                    }} 
                    onAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Rain Protection Section */}
        <Box ref={sectionRefs.rain} sx={{ mb: 10 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold', 
              color: 'primary.main',
              mb: 4,
              borderBottom: '3px solid',
              borderColor: 'primary.main',
              pb: 1,
              display: 'inline-block'
            }}
          >
            Rain Protection
          </Typography>
          {rainLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : rainError ? (
            <Typography color="error" sx={{ textAlign: 'center', py: 4 }}>
              Error loading rain products: {rainError}
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {rainProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <ProductCard 
                    product={{
                      id: product.id,
                      name: product.product_name,
                      price: `$${product.price}`,
                      image: product.img_url,
                      description: product.description
                    }} 
                    onAddToCart={handleAddToCart}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Fab 
          color="primary" 
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            transition: 'all 0.3s ease'
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, onAddToCart }) => (
  <Card sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: 6
    }
  }}>
    <CardMedia
      component="img"
      height="200"
      image={product.image}
      alt={product.name}
      sx={{ objectFit: 'contain', p: 2 }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
        {product.name}
      </Typography>
      {product.description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
      )}
      <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mt: 1 }}>
        {product.price}
      </Typography>
    </CardContent>
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Button size="small" variant="outlined" color="primary" sx={{ fontWeight: 'bold' }}>
        Details
      </Button>
      <Button 
        size="small" 
        variant="contained" 
        color="primary" 
        sx={{ fontWeight: 'bold' }}
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </Button>
    </Box>
  </Card>
);