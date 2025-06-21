import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  Container,
  Rating,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Hotel } from '../types';

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHotel();
    }
  }, [id]);

  useEffect(() => {
    if (hotel && user) {
      setIsFavorite(user.favorites.includes(hotel._id));
    }
  }, [hotel, user]);

  const fetchHotel = async () => {
    try {
      setLoading(true);
      const response = await hotelAPI.getHotel(id!);
      
      if (response.success && response.data) {
        setHotel(response.data);
      } else {
        setError('飯店不存在');
      }
    } catch (err) {
      setError('載入飯店資料失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await hotelAPI.toggleFavorite(hotel!._id);
      if (response.success) {
        setIsFavorite(!isFavorite);
      }
    } catch (err) {
      setError('操作失敗');
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

  if (error || !hotel) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error || '飯店不存在'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        {/* Hotel Images */}
        <Card sx={{ mb: 3 }}>
          <CardMedia
            component="img"
            height="400"
            image={hotel.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
            alt={hotel.name}
          />
        </Card>

        {/* Hotel Info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {hotel.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                {hotel.location}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={hotel.rating} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {hotel.rating} / 5
              </Typography>
            </Box>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              NT$ {hotel.price.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              每晚
            </Typography>
            <Button
              variant={isFavorite ? "contained" : "outlined"}
              startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleToggleFavorite}
              sx={{ mt: 1 }}
            >
              {isFavorite ? '已收藏' : '收藏'}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Main Content */}
          <Box sx={{ flex: 2 }}>
            {/* Description */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                飯店介紹
              </Typography>
              <Typography variant="body1" paragraph>
                {hotel.description}
              </Typography>
            </Paper>

            {/* Amenities */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                設施與服務
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {hotel.amenities.map((amenity, index) => (
                  <Chip
                    key={index}
                    icon={<CheckIcon />}
                    label={amenity}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: 1 }}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                預訂資訊
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  NT$ {hotel.price.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  每晚
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mb: 2 }}
                onClick={() => navigate('/messages')}
              >
                詢問詳情
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/hotels')}
              >
                查看更多飯店
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default HotelDetail; 