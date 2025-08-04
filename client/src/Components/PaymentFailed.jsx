import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';

export const PaymentFailed = () => {
    const navigate = useNavigate();

    return (
        <Container sx={{ py: 4, mt: 8, textAlign: 'center' }}>
            <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Payment Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Your payment was not successful. Please try again.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/cart')}
                >
                    Return to Cart
                </Button>
                <Button 
                    variant="outlined"
                    onClick={() => navigate('/shop')}
                >
                    Continue Shopping
                </Button>
            </Box>
        </Container>
    );
};