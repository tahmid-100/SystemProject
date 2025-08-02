import React, { useRef, useState, useEffect } from "react";
import { 
  Box, Button, Container, Grid, Typography, 
  Card, CardContent, CardMedia, Fab, CircularProgress
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const Shop = () => {
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
  const [powerLoading, setPowerLoading] = useState(true);
  const [sleepLoading, setSleepLoading] = useState(true);
  const [powerError, setPowerError] = useState(null);
  const [sleepError, setSleepError] = useState(null);

  // Fix body overflow issue on mount
  useEffect(() => {
    // Store original body styles
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    
    // Apply scrollable styles
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.body.style.minHeight = '100vh';
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

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
        // Use full URL in development
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
        // Use full URL in development
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

  // Scroll to section function
  const scrollToSection = (category) => {
    setActiveCategory(category);
    const element = sectionRefs[category].current;
    if (element) {
      const headerOffset = 130; // Account for navbar + sticky nav
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

  // Static product data for other categories
  const staticProducts = {
    security: [
      { id: 9, name: "RFID Blocking Wallet", price: "$22.99", image: "https://via.placeholder.com/300?text=RFID+Wallet" },
      { id: 10, name: "Travel Lock Set", price: "$15.99", image: "https://via.placeholder.com/300?text=Travel+Locks" },
      { id: 11, name: "Anti-Theft Backpack", price: "$79.99", image: "https://via.placeholder.com/300?text=Anti-Theft+Bag" },
      { id: 12, name: "Portable Door Alarm", price: "$14.99", image: "https://via.placeholder.com/300?text=Door+Alarm" },
    ],
    bags: [
      { id: 13, name: "Waterproof Backpack", price: "$49.99", image: "https://via.placeholder.com/300?text=Waterproof+Bag" },
      { id: 14, name: "Packable Daypack", price: "$34.99", image: "https://via.placeholder.com/300?text=Daypack" },
      { id: 15, name: "Rolling Suitcase", price: "$129.99", image: "https://via.placeholder.com/300?text=Suitcase" },
      { id: 16, name: "Travel Toiletry Bag", price: "$24.99", image: "https://via.placeholder.com/300?text=Toiletry+Bag" },
    ],
    rain: [
      { id: 17, name: "Compact Travel Umbrella", price: "$18.99", image: "https://via.placeholder.com/300?text=Travel+Umbrella" },
      { id: 18, name: "Waterproof Jacket", price: "$59.99", image: "https://via.placeholder.com/300?text=Rain+Jacket" },
      { id: 19, name: "Waterproof Shoe Covers", price: "$14.99", image: "https://via.placeholder.com/300?text=Shoe+Covers" },
      { id: 20, name: "Dry Bag 20L", price: "$29.99", image: "https://via.placeholder.com/300?text=Dry+Bag" },
    ]
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
          <Grid container spacing={4}>
            {staticProducts.security.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
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
          <Grid container spacing={4}>
            {staticProducts.bags.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
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
          <Grid container spacing={4}>
            {staticProducts.rain.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
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
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => (
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
      <Button size="small" variant="contained" color="primary" sx={{ fontWeight: 'bold' }}>
        Add to Cart
      </Button>
    </Box>
  </Card>
);