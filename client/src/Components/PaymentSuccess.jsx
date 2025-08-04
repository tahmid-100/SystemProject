import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

export const PaymentSuccess = () => {
    const navigate = useNavigate();

    return (
        <Container sx={{ py: 4, mt: 8, textAlign: 'center' }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
                Payment Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Your order has been confirmed and will be processed shortly.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/shop')}
                >
                    Continue Shopping
                </Button>
                <Button 
                    variant="outlined"
                    onClick={() => navigate('/userprofile')}
                >
                    View Orders
                </Button>
            </Box>
        </Container>
    );
};