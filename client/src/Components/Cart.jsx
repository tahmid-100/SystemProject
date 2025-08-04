import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        setError("Please login to view your cart");
        setLoading(false);
        return;
      }

      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001' 
        : '';

      const response = await fetch(`${baseUrl}/api/cart/${userId}`);
      
      if (response.ok) {
        const cartData = await response.json();
        setCartItems(cartData.products);
        setTotalPrice(parseFloat(cartData.totalPrice));
        setTotalItems(cartData.totalItems);
      } else {
        throw new Error('Failed to fetch cart items');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const userId = localStorage.getItem("userId");
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001' 
        : '';

      const response = await fetch(`${baseUrl}/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: newQuantity
        }),
      });

      if (response.ok) {
        fetchCartItems(); // Refresh cart items
      } else {
        throw new Error('Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const userId = localStorage.getItem("userId");
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001' 
        : '';

      const response = await fetch(`${baseUrl}/api/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId
        }),
      });

      if (response.ok) {
        fetchCartItems(); // Refresh cart items
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  const clearCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const baseUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3001' 
        : '';

      const response = await fetch(`${baseUrl}/api/cart/clear/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCartItems([]);
        setTotalPrice(0);
        setTotalItems(0);
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your cart...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4, mt: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/shop')}
          variant="outlined"
        >
          Continue Shopping
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            <ShoppingCartIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
            Shopping Cart
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {totalItems} item{totalItems !== 1 ? 's' : ''} in your cart
          </Typography>
        </Box>
      </Box>

      {cartItems.length === 0 ? (
        // Empty Cart
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCartIcon sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start shopping to add items to your cart
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/shop')}
          >
            Start Shopping
          </Button>
        </Box>
      ) : (
        // Cart Items
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Items in Cart</Typography>
              <Button
                color="error"
                onClick={clearCart}
                variant="outlined"
                size="small"
              >
                Clear All
              </Button>
            </Box>
            
            {cartItems.map((item) => (
              <Card key={item.productId} sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Product Image */}
                  <Grid item xs={12} sm={3}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={item.image}
                      alt={item.name}
                      sx={{ objectFit: 'contain', borderRadius: 1 }}
                    />
                  </Grid>
                  
                  {/* Product Details */}
                  <Grid item xs={12} sm={5}>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    {item.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.description}
                      </Typography>
                    )}
                    <Typography variant="h6" color="primary">
                      ${item.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  
                  {/* Quantity Controls */}
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          if (newQuantity > 0) {
                            updateQuantity(item.productId, newQuantity);
                          }
                        }}
                        inputProps={{ min: 1, style: { textAlign: 'center', width: '50px' } }}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  {/* Subtotal & Remove */}
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => removeFromCart(item.productId)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Grid>
          
          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal ({totalItems} items):</Typography>
                <Typography>${totalPrice.toFixed(2)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>FREE</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>${(totalPrice * 0.08).toFixed(2)}</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${(totalPrice + totalPrice * 0.08).toFixed(2)}
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mb: 2 }}
              >
                Proceed to Checkout
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/shop')}
              >
                Continue Shopping
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};