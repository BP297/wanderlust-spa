import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Button,
  Rating,
  Chip,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { hotelAPI } from '../services/api';
import { Hotel } from '../types';

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const [favoriteHotels, setFavoriteHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.favorites.length > 0) {
      fetchFavoriteHotels();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavoriteHotels = async () => {
    try {
      setLoading(true);
      const hotelPromises = user!.favorites.map(id => hotelAPI.getHotel(id));
      const responses = await Promise.all(hotelPromises);
      
      const hotels = responses
        .filter(response => response.success && response.data)
        .map(response => response.data!);
      
      setFavoriteHotels(hotels);
    } catch (err) {
      setError('載入收藏飯店失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (hotelId: string) => {
    try {
      const response = await hotelAPI.toggleFavorite(hotelId);
      if (response.success) {
        setFavoriteHotels(prev => prev.filter(hotel => hotel._id !== hotelId));
      }
    } catch (err) {
      setError('移除收藏失敗');
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          我的收藏
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {!user ? (
          <Alert severity="info">
            請先登入以查看您的收藏
          </Alert>
        ) : favoriteHotels.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              您還沒有收藏任何飯店
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/hotels"
              sx={{ mt: 2 }}
            >
              瀏覽飯店
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {favoriteHotels.map((hotel) => (
              <Box sx={{ flex: { xs: '1 1 100%', sm: '0 0 calc(50% - 8px)', md: '0 0 calc(33.333% - 5.33px)' } }} key={hotel._id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease-in-out',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'}
                    alt={hotel.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h3">
                      {hotel.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {hotel.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {hotel.description.substring(0, 100)}...
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={hotel.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {hotel.rating}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <Chip key={index} label={amenity} size="small" />
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary">
                        NT$ {hotel.price.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          component={RouterLink}
                          to={`/hotels/${hotel._id}`}
                          variant="outlined"
                          size="small"
                        >
                          查看詳情
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleRemoveFavorite(hotel._id)}
                        >
                          移除收藏
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Favorites; 